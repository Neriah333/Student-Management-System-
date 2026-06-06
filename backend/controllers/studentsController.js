const { Student, ClassStream } = require('../models');
const { Op } = require('sequelize');


// ======================
// CREATE STUDENT
// ======================
exports.createStudent = async (req, res) => {
  try {
    const { admissionNumber, firstName, lastName, classStreamId } = req.body;

    if (!admissionNumber || !firstName || !lastName || !classStreamId) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    // check duplicate admission number
    const existing = await Student.findOne({
      where: { admissionNumber }
    });

    if (existing) {
      return res.status(400).json({
        message: 'Admission number already exists'
      });
    }

    // validate class stream exists
    const stream = await ClassStream.findByPk(classStreamId);

    if (!stream) {
      return res.status(404).json({
        message: 'Class stream not found'
      });
    }

    const student = await Student.create({
      admissionNumber,
      firstName,
      lastName,
      classStreamId
    });

    res.status(201).json(student);

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// ======================
// GET ALL STUDENTS
// ======================
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: {
        model: ClassStream,
        as: 'classStream'
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(students);

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// ======================
// GET SINGLE STUDENT
// ======================
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: {
        model: ClassStream,
        as: 'classStream'
      }
    });

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    res.status(200).json(student);

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// ======================
// UPDATE STUDENT
// ======================
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { admissionNumber, firstName, lastName, classStreamId } = req.body;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    // check duplicate admission number
    if (admissionNumber) {
      const existing = await Student.findOne({
        where: { admissionNumber }
      });

      if (existing && existing.id != id) {
        return res.status(400).json({
          message: 'Admission number already in use'
        });
      }
    }

    // validate class stream if provided
    if (classStreamId) {
      const stream = await ClassStream.findByPk(classStreamId);

      if (!stream) {
        return res.status(404).json({
          message: 'Class stream not found'
        });
      }
    }

    await student.update({
      admissionNumber: admissionNumber || student.admissionNumber,
      firstName: firstName || student.firstName,
      lastName: lastName || student.lastName,
      classStreamId: classStreamId || student.classStreamId
    });

    res.status(200).json({
      message: 'Student updated successfully',
      data: student
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// ======================
// FILTER STUDENTS
// ======================
exports.filterStudents = async (req, res) => {
  try {
    const { form, stream } = req.query;

    // Build dynamic filter for ClassStream
    const streamFilter = {};

    if (form) {
      streamFilter.form = form;
    }

    if (stream) {
      streamFilter.stream = stream;
    }

    const students = await Student.findAll({
      include: [
        {
          model: ClassStream,
          as: 'classStream',
          where: Object.keys(streamFilter).length ? streamFilter : undefined
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      count: students.length,
      data: students
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};


// ======================
// DELETE STUDENT
// ======================
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    await student.destroy();

    res.status(200).json({
      message: 'Student deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};