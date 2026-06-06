const { Subject, AssessmentScore } = require('../models');
const { Op } = require('sequelize');


// ======================
// CREATE SUBJECT
// ======================
exports.createSubject = async (req, res) => {
  try {
    let { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        message: 'Name and code are required'
      });
    }

    name = name.trim();
    code = code.trim().toUpperCase();

    const existing = await Subject.findOne({
      where: {
        [Op.or]: [{ name }, { code }]
      }
    });

    if (existing) {
      return res.status(400).json({
        message: 'Subject already exists'
      });
    }

    const subject = await Subject.create({ name, code });

    res.status(201).json(subject);

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// ======================
// GET ALL SUBJECTS
// ======================
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      count: subjects.length,
      data: subjects
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// ======================
// GET SINGLE SUBJECT
// ======================
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found'
      });
    }

    res.status(200).json(subject);

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// ======================
// UPDATE SUBJECT
// ======================
exports.updateSubject = async (req, res) => {
  try {
    let { name, code } = req.body;

    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found'
      });
    }

    if (name) name = name.trim();
    if (code) code = code.trim().toUpperCase();

    if (name || code) {
      const duplicate = await Subject.findOne({
        where: {
          [Op.or]: [{ name }, { code }]
        }
      });

      if (duplicate && duplicate.id != req.params.id) {
        return res.status(400).json({
          message: 'Subject name or code already exists'
        });
      }
    }

    await subject.update({
      name: name || subject.name,
      code: code || subject.code
    });

    res.status(200).json({
      message: 'Subject updated successfully',
      data: subject
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// ======================
// DELETE SUBJECT (SAFE)
// ======================
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found'
      });
    }

    // prevent deletion if linked to results
    const used = await AssessmentScore.count({
      where: { subjectId: req.params.id }
    });

    if (used > 0) {
      return res.status(400).json({
        message: 'Cannot delete subject with existing assessment records'
      });
    }

    await subject.destroy();

    res.status(200).json({
      message: 'Subject deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};