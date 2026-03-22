export const ALGORITHMS = [
  {
    id: 'FCFS',
    type: 'non-preemptive',
    name: 'First Come First Serve',
    description:
      'Processes are executed in the order they arrive. Simple and fair, but can cause convoy effect.',
    color: '#6366f1',
  },
  {
    id: 'SJF',
    type: 'non-preemptive',
    name: 'Shortest Job First',
    description:
      'Selects the process with the shortest burst time. Optimal for minimizing average waiting time.',
    color: '#22c55e',
  },
  {
    id: 'LJF',
    type: 'non-preemptive',
    name: 'Longest Job First',
    description:
      'Selects the process with the longest burst time. Can cause starvation for short processes.',
    color: '#f59e0b',
  },
  {
    id: 'Round Robin',
    type: 'preemptive',
    name: 'Round Robin',
    description:
      'Each process gets a fixed time quantum. Fair and bounded response time, but depends on quantum size.',
    color: '#f43f5e',
  },
  {
    id: 'Priority Scheduling',
    type: 'non-preemptive',
    name: 'Priority Scheduling',
    description:
      'Selects the process with the highest priority (lowest priority number). Allows prioritizing important processes but can starve low-priority ones.',
    color: '#ec4899',
  },
  {
    id: 'SRTF',
    type: 'preemptive',
    name: 'Shortest Remaining Time First',
    description:
      'Preemptive version of SJF. Selects the process with shortest remaining burst time. Minimizes waiting time but causes frequent context switches.',
    color: '#8b5cf6',
  },
  {
    id: 'HRTF',
    type: 'non-preemptive',
    name: 'Highest Response Time First',
    description:
      'Selects the process that has been waiting the longest. Prevents starvation and improves fairness for long-running processes.',
    color: '#06b6d4',
  },
];
