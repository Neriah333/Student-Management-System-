const { sequelize } = require("../config/db");

const Student = require("./students");
const ClassStream = require("./stream");
const Subject = require("./subjects");
const AssessmentScore = require("./assessments");

// ======================
// STREAM → STUDENT
// ======================
ClassStream.hasMany(Student, {
  foreignKey: "classStreamId",
  as: "students",
});

Student.belongsTo(ClassStream, {
  foreignKey: "classStreamId",
  as: "classStream",
});

// ======================
// STUDENT → ASSESSMENT (FIXED)
// ======================
Student.hasMany(AssessmentScore, {
  foreignKey: "studentId",
  as: "assessments",
});

AssessmentScore.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

// ======================
// SUBJECT → ASSESSMENT
// ======================
Subject.hasMany(AssessmentScore, {
  foreignKey: "subjectId",
  as: "assessments",
});

AssessmentScore.belongsTo(Subject, {
  foreignKey: "subjectId",
  as: "subject",
});

module.exports = {
  sequelize,
  Student,
  ClassStream,
  Subject,
  AssessmentScore,
};