const express = require('express');
const router = express.Router();
const { saveProcesses, getProcesses, runSchedule } = require('../controllers/schedulerController');

router.post('/processes', saveProcesses);
router.get('/processes/:id', getProcesses);
router.post('/schedule', runSchedule);

module.exports = router;
