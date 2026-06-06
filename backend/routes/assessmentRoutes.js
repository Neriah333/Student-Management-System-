const express = require('express');
const router = express.Router();

const controller = require('../controllers/assessmentController');

router.post('/', controller.saveAssessment); // CREATE + UPDATE (UPSERT)
router.get('/', controller.getAllAssessments);
router.get('/:id', controller.getAssessmentById);
router.delete('/:id', controller.deleteAssessment);

module.exports = router;