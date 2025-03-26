const express =require('express')
const jwtMiddleware = require('../middleware/jwtMiddleware')
const multerMiddleware = require('../middleware/multerMiddleware')

const userController = require('../controllers/userController')
const taskController =require('../controllers/taskController')


const router =new express.Router()

router.post('/register',userController.registerController)

router.post('/login',userController.loginController)

router.post('/add-task',jwtMiddleware,multerMiddleware.single('taskImage'),taskController.addTaskController)

router.get('/all-task',jwtMiddleware,taskController.getAllTaskController)

router.put('/tasks/:id/edit-task',multerMiddleware.single('taskImage'),jwtMiddleware,taskController.updateTaskController)

router.delete('/tasks/:id/delete-task',jwtMiddleware,taskController.deleteTaskController)

router.get('/tasks/:id', jwtMiddleware,taskController.getTaskById);

router.put('/edit-user',jwtMiddleware,multerMiddleware.single('profileImage'),userController.editUserController)


module.exports = router