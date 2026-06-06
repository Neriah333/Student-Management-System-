const router = require("express").Router();
const controller = require("../controllers/subjectstreamController");

router.post("/", controller.assignSubjectToStream);

module.exports = router;