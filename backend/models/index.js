const { sequelize } = require('../config/db');

const Student = require('./students');
const ClassStream = require('./stream');
const Subject = require('./subjects');
const AssessmentScore = require('./assessments');
const GradingScale = require('./gradingscale');


// ======================
// RELATIONSHIPS
// ======================

// ClassStream → Student
ClassStream.hasMany(Student, {
  foreignKey: 'classStreamId',
  as: 'students'
});

Student.belongsTo(ClassStream, {
  foreignKey: 'classStreamId',
  as: 'classStream'
});


// Student → AssessmentScore
Student.hasMany(AssessmentScore, {
  foreignKey: 'studentId',
  as: 'assessments'
});

AssessmentScore.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student'
});


// Subject → AssessmentScore
Subject.hasMany(AssessmentScore, {
  foreignKey: 'subjectId',
  as: 'assessments'
});

AssessmentScore.belongsTo(Subject, {
  foreignKey: 'subjectId',
  as: 'subject'
});


// ======================
// EXPORTS
// ======================
module.exports = {
  sequelize,
  Student,
  ClassStream,
  Subject,
  AssessmentScore,
  GradingScale
};