
const express = require('express');
const { getDailyReport, getWeeklyReport, getMonthlyReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/daily', getDailyReport);
router.get('/weekly', getWeeklyReport);
router.get('/monthly', getMonthlyReport);

module.exports = router;
