const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },

  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },

  type: {
    type: DataTypes.ENUM('Core', 'Elective'),
    defaultValue: 'Core'
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

}, {
  timestamps: true
});

module.exports = Subject;