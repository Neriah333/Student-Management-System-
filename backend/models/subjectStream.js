const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const SubjectStream = sequelize.define("SubjectStream", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  classStreamId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = SubjectStream;