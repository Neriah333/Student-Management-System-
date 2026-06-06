const { ClassStream, Student, Subject } = require("../models");

// ======================
// CREATE STREAM
// ======================
exports.createClassStream = async (req, res) => {
  try {
    const { form, stream } = req.body;

    if (!form || !stream) {
      return res.status(400).json({
        message: "Form and stream are required"
      });
    }

    const existing = await ClassStream.findOne({
      where: { form, stream }
    });

    if (existing) {
      return res.status(400).json({
        message: "Class stream already exists"
      });
    }

    const newStream = await ClassStream.create({ form, stream });

    res.status(201).json(newStream);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};



// ======================
// GET ALL STREAMS (FIXED)
// ======================
exports.getAllStreams = async (req, res) => {
  try {
    const streams = await ClassStream.findAll({
      include: [
        {
          model: Student,
          as: "students"
        },
        {
          model: Subject,
          as: "subjects"   // 🔥 THIS WAS MISSING
        }
      ],
      order: [["form", "ASC"], ["stream", "ASC"]]
    });

    res.status(200).json(streams);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};



// ======================
// GET SINGLE STREAM
// ======================
exports.getStreamDetails = async (req, res) => {
  try {
    const stream = await ClassStream.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: "students"
        },
        {
          model: Subject,
          as: "subjects"   // 🔥 ALSO ADD HERE
        }
      ]
    });

    if (!stream) {
      return res.status(404).json({
        message: "Class stream not found"
      });
    }

    res.status(200).json(stream);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};



// ======================
// UPDATE STREAM
// ======================
exports.updateClassStream = async (req, res) => {
  try {
    const { id } = req.params;
    const { form, stream } = req.body;

    const classStream = await ClassStream.findByPk(id);

    if (!classStream) {
      return res.status(404).json({
        message: "Class stream not found"
      });
    }

    const duplicate = await ClassStream.findOne({
      where: { form, stream }
    });

    if (duplicate && duplicate.id != id) {
      return res.status(400).json({
        message: "Another stream already uses this combination"
      });
    }

    await classStream.update({
      form: form || classStream.form,
      stream: stream || classStream.stream
    });

    res.status(200).json({
      message: "Updated successfully",
      data: classStream
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};



// ======================
// DELETE STREAM
// ======================
exports.deleteClassStream = async (req, res) => {
  try {
    const { id } = req.params;

    const classStream = await ClassStream.findByPk(id);

    if (!classStream) {
      return res.status(404).json({
        message: "Class stream not found"
      });
    }

    const studentCount = await Student.count({
      where: { classStreamId: id }
    });

    if (studentCount > 0) {
      return res.status(400).json({
        message: `Cannot delete stream with ${studentCount} students`
      });
    }

    await classStream.destroy();

    res.status(200).json({
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};