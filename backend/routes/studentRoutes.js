const express = require('express');
const router = express.Router();

const controller = require('../controllers/studentsController');

router.post('/', controller.createStudent);
router.get('/', controller.getAllStudents);
router.get('/filter', controller.filterStudents);
router.get('/:id', controller.getStudentById);
router.put('/:id', controller.updateStudent);
router.delete('/:id', controller.deleteStudent);

module.exports = router;