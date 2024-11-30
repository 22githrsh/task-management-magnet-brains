const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getAllTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const router = express.Router();

router.get('/', authMiddleware, getAllTasks);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);


module.exports = router;
