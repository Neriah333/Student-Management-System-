const express = require('express');
const router = express.Router();

const controller = require('../controllers/gradingscaleController');

// grading scale management
router.get('/grading-scales', controller.getAllGradingScales);
router.post('/grading-scales', controller.createGradingScale);
router.put('/grading-scales/:id', controller.updateGradingScale);
router.delete('/grading-scales/:id', controller.deleteGradingScale);

// ranking
router.get('/subject-ranking', controller.getSubjectRanking);
router.get('/class-ranking', controller.getClassRanking);
router.get('/class-performance', controller.getClassPerformance);

// report card
router.get('/report-card/:studentId', controller.getStudentReportCard);

module.exports = router;