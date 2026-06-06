const { AssessmentScore, Student, Subject, GradingScale } = require("../models");

const defaultScale = [
  { grade: "A", minScore: 80, maxScore: 100 },
  { grade: "B", minScore: 70, maxScore: 79.99 },
  { grade: "C", minScore: 60, maxScore: 69.99 },
  { grade: "D", minScore: 50, maxScore: 59.99 },
  { grade: "F", minScore: 0, maxScore: 49.99 },
];

const getGradingScales = async () => {
  const scales = await GradingScale.findAll({ order: [["minScore", "DESC"]] });
  return scales.length ? scales : defaultScale;
};

const getGrade = async (total) => {
  const scales = await getGradingScales();
  const scale = scales.find((s) => {
    const min = Number(s.minScore);
    const max = Number(s.maxScore);
    return total >= min && total <= max;
  });

  if (scale) return scale.grade;

  if (total >= 80) return "A";
  if (total >= 70) return "B";
  if (total >= 60) return "C";
  if (total >= 50) return "D";
  return "F";
};

const updateSubjectPositions = async (subjectId, classStreamId) => {
  const scores = await AssessmentScore.findAll({
    where: { subjectId },
    include: [
      {
        model: Student,
        as: "student",
        where: { classStreamId },
      },
    ],
    order: [["totalScore", "DESC"]],
  });

  for (let index = 0; index < scores.length; index += 1) {
    const score = scores[index];
    await score.update({ subjectPosition: index + 1 });
  }
};

// ======================
// CREATE / UPDATE
// ======================
exports.saveAssessment = async (req, res) => {
  try {
    let {
      studentId,
      subjectId,
      continuousAssessmentScore,
      examScore,
    } = req.body;

    if (!studentId || !subjectId) {
      return res.status(400).json({ message: "studentId and subjectId required" });
    }

    const student = await Student.findByPk(studentId);
    const subject = await Subject.findByPk(subjectId);

    if (!student || !subject) {
      return res.status(404).json({ message: "Student or Subject not found" });
    }

    const ca = Number(continuousAssessmentScore || 0);
    const exam = Number(examScore || 0);

    if (isNaN(ca) || isNaN(exam)) {
      return res.status(400).json({ message: "Scores must be numbers" });
    }

    const total = ca + exam;
    const grade = await getGrade(total);

    let record = await AssessmentScore.findOne({
      where: { studentId, subjectId },
    });

    if (record) {
      await record.update({
        continuousAssessmentScore: ca,
        examScore: exam,
        totalScore: total,
        grade,
      });

      await updateSubjectPositions(subjectId, student.classStreamId);

      return res.json({
        message: "Updated",
        data: record,
      });
    }

    record = await AssessmentScore.create({
      studentId,
      subjectId,
      continuousAssessmentScore: ca,
      examScore: exam,
      totalScore: total,
      grade,
    });

    await updateSubjectPositions(subjectId, student.classStreamId);

    return res.status(201).json({
      message: "Created",
      data: record,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// ======================
exports.getAllAssessments = async (req, res) => {
  try {
    const data = await AssessmentScore.findAll({
      include: [
        { model: Student, as: "student" },
        { model: Subject, as: "subject" },
      ],
      order: [["totalScore", "DESC"]],
    });

    return res.json({
      count: data.length,
      data,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ======================
exports.getAssessmentById = async (req, res) => {
  try {
    const data = await AssessmentScore.findByPk(req.params.id, {
      include: [
        { model: Student, as: "student" },
        { model: Subject, as: "subject" },
      ],
    });

    if (!data) return res.status(404).json({ message: "Not found" });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ======================
exports.deleteAssessment = async (req, res) => {
  try {
    const record = await AssessmentScore.findByPk(req.params.id);

    if (!record) return res.status(404).json({ message: "Not found" });

    await record.destroy();

    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};