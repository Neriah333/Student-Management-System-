const express = require("express");
const router = express.Router();

const {
  saveAssessment,
  getAllAssessments,
  getAssessmentById,
  deleteAssessment,
} = require("../controllers/assessmentController");

router.post("/", saveAssessment);
router.get("/", getAllAssessments);
router.get("/:id", getAssessmentById);
router.delete("/:id", deleteAssessment);

module.exports = router;