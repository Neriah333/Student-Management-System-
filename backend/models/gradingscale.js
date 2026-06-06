// models/GradingScale.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const GradingScale = sequelize.define('GradingScale', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  grade: {
    type: DataTypes.STRING(2), // A, B, C, etc.
    allowNull: false,
    unique: true
  },

  minScore: {
    type: DataTypes.DECIMAL(5, 2), // ✅ match AssessmentScore type
    allowNull: false
  },

  maxScore: {
    type: DataTypes.DECIMAL(5, 2), // ✅ match AssessmentScore type
    allowNull: false
  },

  remarks: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false,

  // 🔥 Optional safety validation
  validate: {
    minLessThanMax() {
      if (this.minScore > this.maxScore) {
        throw new Error('minScore cannot be greater than maxScore');
      }
    }
  }
});

module.exports = GradingScale;