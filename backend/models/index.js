const { sequelize } = require('../config/db');

const Student = require('./students');
const ClassStream = require('./stream');
const Subject = require('./subjects');
const AssessmentScore = require('./assessments');
const GradingScale = require('./gradingscale');
const SubjectStream = require('./subjectStream'); // ✅ correct file

// ======================
// STREAM → STUDENT
// ======================
ClassStream.hasMany(Student, {
  foreignKey: 'classStreamId',
  as: 'students'
});

Student.belongsTo(ClassStream, {
  foreignKey: 'classStreamId',
  as: 'classStream'
});

// ======================
// SUBJECT → ASSESSMENTS
// ======================
Subject.hasMany(AssessmentScore, {
  foreignKey: 'subjectId',
  as: 'assessments'
});

AssessmentScore.belongsTo(Subject, {
  foreignKey: 'subjectId',
  as: 'subject'
});

// ======================
// MANY TO MANY: SUBJECT ↔ STREAM
// ======================
Subject.belongsToMany(ClassStream, {
  through: SubjectStream,
  foreignKey: 'subjectId',
  as: 'streams'
});

ClassStream.belongsToMany(Subject, {
  through: SubjectStream,
  foreignKey: 'classStreamId',
  as: 'subjects'
});

module.exports = {
  sequelize,
  Student,
  ClassStream,
  Subject,
  AssessmentScore,
  GradingScale,
  SubjectStream
};