const express = require('express');
const router = express.Router();

const controller = require('../controllers/streamController');

router.post('/', controller.createClassStream);
router.get('/', controller.getAllStreams);
router.get('/:id', controller.getStreamDetails);
router.put('/:id', controller.updateClassStream);
router.delete('/:id', controller.deleteClassStream);

module.exports = router;