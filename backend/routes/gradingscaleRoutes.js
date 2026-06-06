const express = require('express');
const router = express.Router();

const controller = require('../controllers/gradingscaleController');

// ranking
router.get('/subject-ranking', controller.getSubjectRanking);
router.get('/class-ranking', controller.getClassRanking);

// report card
router.get('/report-card/:studentId', controller.getStudentReportCard);

module.exports = router;