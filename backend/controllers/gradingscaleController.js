const { AssessmentScore, Student, Subject, ClassStream, GradingScale } = require('../models');

const defaultScale = [
  { grade: 'A', minScore: 80, maxScore: 100 },
  { grade: 'B', minScore: 70, maxScore: 79.99 },
  { grade: 'C', minScore: 60, maxScore: 69.99 },
  { grade: 'D', minScore: 50, maxScore: 59.99 },
  { grade: 'F', minScore: 0, maxScore: 49.99 },
];

const getGradingScales = async () => {
  const scales = await GradingScale.findAll({ order: [['minScore', 'DESC']] });
  return scales.length ? scales : defaultScale;
};

const getGradeFromAverage = (average, scales) => {
  const gradeScale = scales.find((s) => {
    const min = Number(s.minScore);
    const max = Number(s.maxScore);
    return average >= min && average <= max;
  });
  return gradeScale?.grade || 'F';
};

exports.getAllGradingScales = async (req, res) => {
  try {
    const scales = await GradingScale.findAll({ order: [['minScore', 'DESC']] });
    return res.json({ count: scales.length, data: scales });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createGradingScale = async (req, res) => {
  try {
    const { grade, minScore, maxScore, remarks } = req.body;
    if (!grade || minScore == null || maxScore == null) {
      return res.status(400).json({ message: 'grade, minScore, and maxScore are required' });
    }
    const record = await GradingScale.create({ grade, minScore, maxScore, remarks });
    return res.status(201).json({ message: 'Created', data: record });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateGradingScale = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, minScore, maxScore, remarks } = req.body;
    const record = await GradingScale.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Grading scale not found' });
    await record.update({ grade, minScore, maxScore, remarks });
    return res.json({ message: 'Updated', data: record });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteGradingScale = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await GradingScale.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Grading scale not found' });
    await record.destroy();
    return res.json({ message: 'Deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getSubjectRanking = async (req, res) => {
  try {
    const { subjectId, classStreamId } = req.query;
    if (!subjectId || !classStreamId) {
      return res.status(400).json({ message: 'subjectId and classStreamId are required' });
    }

    const results = await AssessmentScore.findAll({
      where: { subjectId },
      include: [
        {
          model: Student,
          as: 'student',
          where: { classStreamId },
          include: [{ model: ClassStream, as: 'classStream' }],
        },
        { model: Subject, as: 'subject' },
      ],
      order: [['totalScore', 'DESC']],
    });

    const ranked = results.map((r, index) => ({
      rank: index + 1,
      student: {
        id: r.student.id,
        name: `${r.student.firstName} ${r.student.lastName}`,
        admissionNumber: r.student.admissionNumber,
      },
      subject: r.subject.name,
      totalScore: r.totalScore,
      grade: r.grade,
      position: r.subjectPosition || index + 1,
    }));

    res.status(200).json({ count: ranked.length, data: ranked });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getClassRanking = async (req, res) => {
  try {
    const { classStreamId } = req.query;
    if (!classStreamId) {
      return res.status(400).json({ message: 'classStreamId is required' });
    }

    const students = await Student.findAll({
      where: { classStreamId },
      include: [
        { model: AssessmentScore, as: 'assessments', include: [{ model: Subject, as: 'subject' }] },
        { model: ClassStream, as: 'classStream' },
      ],
    });

    const scales = await getGradingScales();

    const ranked = students
      .map((student) => {
        const total = student.assessments.reduce((sum, a) => sum + Number(a.totalScore || 0), 0);
        const count = student.assessments.length;
        const average = count ? total / count : 0;
        return {
          student: {
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            admissionNumber: student.admissionNumber,
            class: student.classStream?.form + ' ' + student.classStream?.stream,
          },
          totalScore: total,
          average: average.toFixed(2),
          grade: getGradeFromAverage(average, scales),
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((s, index) => ({ rank: index + 1, ...s }));

    res.status(200).json({ count: ranked.length, data: ranked });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getStudentReportCard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findByPk(studentId, {
      include: [
        { model: ClassStream, as: 'classStream' },
        { model: AssessmentScore, as: 'assessments', include: [{ model: Subject, as: 'subject' }] },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const classStreamId = student.classStreamId;
    const scales = await getGradingScales();

    const subjects = await Promise.all(
      student.assessments.map(async (assessment) => {
        const allSubjectAssessments = await AssessmentScore.findAll({
          where: { subjectId: assessment.subjectId },
          include: [{ model: Student, as: 'student', where: { classStreamId } }],
          order: [['totalScore', 'DESC']],
        });

        const subjectPosition = allSubjectAssessments.findIndex((item) => item.studentId === student.id) + 1;
        return {
          subject: assessment.subject.name,
          ca: assessment.continuousAssessmentScore,
          exam: assessment.examScore,
          total: assessment.totalScore,
          grade: getGradeFromAverage(Number(assessment.totalScore), scales),
          position: subjectPosition || null,
        };
      })
    );

    const totalScore = subjects.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const average = subjects.length ? totalScore / subjects.length : 0;
    const classPosition = (await Student.findAll({
      where: { classStreamId },
      include: [{ model: AssessmentScore, as: 'assessments' }],
    }))
      .map((studentData) => ({
        studentId: studentData.id,
        total: studentData.assessments.reduce((sum, a) => sum + Number(a.totalScore || 0), 0),
      }))
      .sort((a, b) => b.total - a.total)
      .map((item, index) => ({ rank: index + 1, ...item }))
      .find((item) => item.studentId === student.id)?.rank || null;

    res.status(200).json({
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        admissionNumber: student.admissionNumber,
        class: student.classStream?.form + ' ' + student.classStream?.stream,
      },
      summary: {
        totalScore,
        average: average.toFixed(2),
        grade: getGradeFromAverage(average, scales),
        classPosition,
      },
      subjects,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getClassPerformance = async (req, res) => {
  try {
    const { classStreamId } = req.query;
    if (!classStreamId) {
      return res.status(400).json({ message: 'classStreamId is required' });
    }

    const classStream = await ClassStream.findByPk(classStreamId, {
      include: [
        {
          model: Student,
          as: 'students',
          include: [
            {
              model: AssessmentScore,
              as: 'assessments',
              include: [{ model: Subject, as: 'subject' }],
            },
          ],
        },
      ],
    });

    if (!classStream) {
      return res.status(404).json({ message: 'Class stream not found' });
    }

    const scales = await getGradingScales();
    const subjectStats = {};

    const students = classStream.students.map((student) => {
      const totalScore = student.assessments.reduce((sum, a) => sum + Number(a.totalScore || 0), 0);
      const count = student.assessments.length;
      const average = count ? totalScore / count : 0;

      student.assessments.forEach((assessment) => {
        const subjectName = assessment.subject.name;
        if (!subjectStats[subjectName]) {
          subjectStats[subjectName] = {
            subject: subjectName,
            totalScore: 0,
            count: 0,
            highest: Number(assessment.totalScore || 0),
            lowest: Number(assessment.totalScore || 0),
          };
        }

        subjectStats[subjectName].totalScore += Number(assessment.totalScore || 0);
        subjectStats[subjectName].count += 1;
        subjectStats[subjectName].highest = Math.max(subjectStats[subjectName].highest, Number(assessment.totalScore || 0));
        subjectStats[subjectName].lowest = Math.min(subjectStats[subjectName].lowest, Number(assessment.totalScore || 0));
      });

      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        admissionNumber: student.admissionNumber,
        totalScore,
        average: average.toFixed(2),
        grade: getGradeFromAverage(average, scales),
      };
    });

    const rankedStudents = students
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((student, index) => ({ rank: index + 1, ...student }));

    const subjectAverages = Object.values(subjectStats).map((stat) => ({
      subject: stat.subject,
      average: stat.count ? (stat.totalScore / stat.count).toFixed(2) : '0.00',
      highest: stat.highest,
      lowest: stat.lowest,
    }));

    const classAverage = rankedStudents.length
      ? (
          rankedStudents.reduce((sum, student) => sum + Number(student.average || 0), 0) /
          rankedStudents.length
        ).toFixed(2)
      : '0.00';

    res.status(200).json({
      class: `${classStream.form} ${classStream.stream}`,
      studentCount: rankedStudents.length,
      subjectCount: subjectAverages.length,
      classAverage,
      students: rankedStudents,
      subjects: subjectAverages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
