const ProcessSet = require('../models/ProcessSet');
const fcfs = require('../services/fcfs');
const sjf = require('../services/sjf');
const ljf = require('../services/ljf');
const roundRobin = require('../services/roundRobin');
const priority = require('../services/priority');
const srtf = require('../services/srtf');
const hrtf = require('../services/hrtf');

const algorithmMap = {
  FCFS: fcfs,
  SJF: sjf,
  LJF: ljf,
  'Priority Scheduling': priority,
  SRTF: srtf,
  HRTF: hrtf,
};

// POST /api/processes — Save a new process set
const saveProcesses = async (req, res) => {
  try {
    const { processes } = req.body;

    if (!processes || !Array.isArray(processes) || processes.length === 0) {
      return res
        .status(400)
        .json({ error: 'At least one process is required' });
    }

    // Validate each process
    for (const p of processes) {
      if (
        !p.processId ||
        p.arrivalTime === undefined ||
        p.burstTime === undefined
      ) {
        return res
          .status(400)
          .json({ error: `Invalid process data: ${JSON.stringify(p)}` });
      }
      if (p.arrivalTime < 0) {
        return res
          .status(400)
          .json({
            error: `Arrival time cannot be negative for ${p.processId}`,
          });
      }
      if (p.burstTime < 1) {
        return res
          .status(400)
          .json({ error: `Burst time must be at least 1 for ${p.processId}` });
      }
    }

    // Check for duplicate process IDs
    const ids = processes.map((p) => p.processId);
    if (new Set(ids).size !== ids.length) {
      return res
        .status(400)
        .json({ error: 'Duplicate process IDs are not allowed' });
    }

    const processSet = await ProcessSet.create({ processes });
    res
      .status(201)
      .json({ id: processSet._id, processes: processSet.processes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/processes/:id — Get a process set
const getProcesses = async (req, res) => {
  try {
    const processSet = await ProcessSet.findById(req.params.id);
    if (!processSet) {
      return res.status(404).json({ error: 'Process set not found' });
    }
    res.json({ id: processSet._id, processes: processSet.processes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/schedule — Run scheduling algorithms
const runSchedule = async (req, res) => {
  try {
    const {
      processSetId,
      processes: directProcesses,
      algorithms,
      timeQuantum,
    } = req.body;

    // Get processes either from DB or directly from request
    let processes;
    if (processSetId) {
      const processSet = await ProcessSet.findById(processSetId);
      if (!processSet) {
        return res.status(404).json({ error: 'Process set not found' });
      }
      processes = processSet.processes.map((p) => ({
        processId: p.processId,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        ...(p.priority !== undefined && { priority: p.priority }),
      }));
    } else if (directProcesses) {
      processes = directProcesses;
    } else {
      return res
        .status(400)
        .json({ error: 'Either processSetId or processes array is required' });
    }

    if (!algorithms || !Array.isArray(algorithms) || algorithms.length === 0) {
      return res
        .status(400)
        .json({ error: 'At least one algorithm must be selected' });
    }

    const results = [];

    for (const algo of algorithms) {
      if (algo === 'Round Robin') {
        if (!timeQuantum || timeQuantum < 1) {
          return res
            .status(400)
            .json({ error: 'Time quantum must be at least 1 for Round Robin' });
        }
        results.push(roundRobin(processes, timeQuantum));
      } else if (algorithmMap[algo]) {
        results.push(algorithmMap[algo](processes));
      } else {
        return res.status(400).json({ error: `Unknown algorithm: ${algo}` });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { saveProcesses, getProcesses, runSchedule };
