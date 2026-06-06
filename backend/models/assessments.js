// models/AssessmentScore.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AssessmentScore = sequelize.define('AssessmentScore', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  studentId: {   // ✅ ADD THIS
    type: DataTypes.INTEGER,
    allowNull: false
  },

  subjectId: {   // ✅ ADD THIS
    type: DataTypes.INTEGER,
    allowNull: false
  },

  continuousAssessmentScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: { min: 0 }
  },

  examScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: { min: 0 }
  },

  totalScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },

  grade: {
    type: DataTypes.STRING(2),
    allowNull: true
  },

  subjectPosition: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,

  indexes: [
    {
      unique: true,
      fields: ['studentId', 'subjectId'], // ✅ FIXED (lowercase camelCase)
      name: 'unique_student_subject_score'
    }
  ]
});

module.exports = AssessmentScore;