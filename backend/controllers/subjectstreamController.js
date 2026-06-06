const { SubjectStream } = require("../models");

// assign subject to stream
exports.assignSubjectToStream = async (req, res) => {
  try {
    const { subjectId, classStreamId } = req.body;

    const existing = await SubjectStream.findOne({
      where: { subjectId, classStreamId }
    });

    if (existing) {
      return res.status(400).json({ message: "Already assigned" });
    }

    const record = await SubjectStream.create({
      subjectId,
      classStreamId
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};