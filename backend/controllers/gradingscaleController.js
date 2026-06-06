const { AssessmentScore, Student, Subject, ClassStream } = require('../models');


// =====================================================
// 🔥 SUBJECT RANKING (per class + subject)
// =====================================================
exports.getSubjectRanking = async (req, res) => {
  try {
    const { subjectId, classStreamId } = req.query;

    if (!subjectId || !classStreamId) {
      return res.status(400).json({
        message: 'subjectId and classStreamId are required'
      });
    }

    const results = await AssessmentScore.findAll({
      where: { subjectId },
      include: [
        {
          model: Student,
          as: 'student',
          where: { classStreamId },
          include: [{
            model: ClassStream,
            as: 'classStream'
          }]
        },
        {
          model: Subject,
          as: 'subject'
        }
      ],
      order: [['totalScore', 'DESC']]
    });

    const ranked = results.map((r, index) => ({
      rank: index + 1,
      student: {
        id: r.student.id,
        name: `${r.student.firstName} ${r.student.lastName}`,
        admissionNumber: r.student.admissionNumber
      },
      subject: r.subject.name,
      totalScore: r.totalScore,
      grade: r.grade
    }));

    res.status(200).json({
      count: ranked.length,
      data: ranked
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// =====================================================
// 🏫 CLASS RANKING (overall performance)
// =====================================================
exports.getClassRanking = async (req, res) => {
  try {
    const { classStreamId } = req.query;

    if (!classStreamId) {
      return res.status(400).json({
        message: 'classStreamId is required'
      });
    }

    const students = await Student.findAll({
      where: { classStreamId },
      include: [
        {
          model: AssessmentScore,
          as: 'assessments'
        },
        {
          model: ClassStream,
          as: 'classStream'
        }
      ]
    });

    const ranked = students.map(student => {
      const total = student.assessments.reduce(
        (sum, a) => sum + Number(a.totalScore || 0),
        0
      );

      const count = student.assessments.length;

      return {
        student: {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          admissionNumber: student.admissionNumber,
          class: student.classStream?.form + ' ' + student.classStream?.stream
        },
        totalScore: total,
        average: count ? (total / count).toFixed(2) : 0
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((s, index) => ({
      rank: index + 1,
      ...s
    }));

    res.status(200).json({
      count: ranked.length,
      data: ranked
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// =====================================================
// 📄 STUDENT REPORT CARD
// =====================================================
exports.getStudentReportCard = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: ClassStream,
          as: 'classStream'
        },
        {
          model: AssessmentScore,
          as: 'assessments',
          include: [
            {
              model: Subject,
              as: 'subject'
            }
          ]
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    const subjects = student.assessments.map(a => ({
      subject: a.subject.name,
      ca: a.continuousAssessmentScore,
      exam: a.examScore,
      total: a.totalScore,
      grade: a.grade
    }));

    const totalScore = student.assessments.reduce(
      (sum, a) => sum + Number(a.totalScore || 0),
      0
    );

    const average = subjects.length
      ? (totalScore / subjects.length).toFixed(2)
      : 0;

    res.status(200).json({
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        admissionNumber: student.admissionNumber,
        class: student.classStream?.form + ' ' + student.classStream?.stream
      },
      summary: {
        totalScore,
        average
      },
      subjects
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};