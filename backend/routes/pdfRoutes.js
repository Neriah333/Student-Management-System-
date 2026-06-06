const express = require('express');
const router = express.Router();

const controller = require('../controllers/pdfController');

// download report card PDF
router.get('/report-card/:studentId', controller.downloadReportCard);
router.get('/class-performance/:classStreamId', controller.downloadClassPerformanceReport);

module.exports = router;