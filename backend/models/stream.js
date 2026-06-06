// models/ClassStream.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ClassStream = sequelize.define('ClassStream', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  form: {
    type: DataTypes.ENUM('Form 1', 'Form 2', 'Form 3', 'Form 4'),
    allowNull: false
  },
  stream: {
    type: DataTypes.ENUM('A', 'B', 'C'),
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['form', 'stream']
    }
  ]
});

module.exports = ClassStream;