const { AssessmentScore, Student, Subject } = require('../models');


// ======================
// GRADE FUNCTION
// ======================
const getGrade = (total) => {
  if (total >= 80) return 'A';
  if (total >= 70) return 'B';
  if (total >= 60) return 'C';
  if (total >= 50) return 'D';
  return 'F';
};


// ======================
// CREATE / UPDATE (UPSERT)
// ======================
exports.saveAssessment = async (req, res) => {
  try {
    const {
      studentId,
      subjectId,
      continuousAssessmentScore,
      examScore
    } = req.body;

    if (!studentId || !subjectId) {
      return res.status(400).json({
        message: 'studentId and subjectId are required'
      });
    }

    // validate student & subject
    const student = await Student.findByPk(studentId);
    const subject = await Subject.findByPk(subjectId);

    if (!student || !subject) {
      return res.status(404).json({
        message: 'Student or Subject not found'
      });
    }

    const ca = Number(continuousAssessmentScore || 0);
    const exam = Number(examScore || 0);
    const total = ca + exam;
    const grade = getGrade(total);

    // check if record exists
    let record = await AssessmentScore.findOne({
      where: { studentId, subjectId }
    });

    if (record) {
      await record.update({
        continuousAssessmentScore: ca,
        examScore: exam,
        totalScore: total,
        grade
      });

      return res.status(200).json({
        message: 'Assessment updated successfully',
        data: record
      });
    }

    record = await AssessmentScore.create({
      studentId,
      subjectId,
      continuousAssessmentScore: ca,
      examScore: exam,
      totalScore: total,
      grade
    });

    res.status(201).json({
      message: 'Assessment created successfully',
      data: record
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// ======================
// GET ALL ASSESSMENTS
// ======================
exports.getAllAssessments = async (req, res) => {
  try {
    const data = await AssessmentScore.findAll({
      include: [
        {
          model: Student,
          as: 'student'
        },
        {
          model: Subject,
          as: 'subject'
        }
      ],
      order: [['totalScore', 'DESC']]
    });

    res.status(200).json({
      count: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// ======================
// GET SINGLE ASSESSMENT
// ======================
exports.getAssessmentById = async (req, res) => {
  try {
    const data = await AssessmentScore.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: 'student'
        },
        {
          model: Subject,
          as: 'subject'
        }
      ]
    });

    if (!data) {
      return res.status(404).json({
        message: 'Assessment not found'
      });
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// ======================
// DELETE ASSESSMENT
// ======================
exports.deleteAssessment = async (req, res) => {
  try {
    const record = await AssessmentScore.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({
        message: 'Assessment not found'
      });
    }

    await record.destroy();

    res.status(200).json({
      message: 'Assessment deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};