const express = require('express')
const router = express.Router()

const controller = require('../controller/auth.controller')
const bookController = require('../controller/book.controller')

const authMiddleware = require('../middlewares/auth.middleware')

// GET Requests
router.get('/', bookController.showMainPage)
router.get('/index', bookController.findAll)
router.get('/login', controller.GetLogin)
router.get('/register', controller.GetRegister)
router.get('/searchById', bookController.getBookById)
router.get('/searchByName', bookController.getBookByName)

router.get('/logout', authMiddleware.requireAuth, authMiddleware.isUser, controller.GetLogout)

// POST Requests
router.post('/login', controller.PostLogin)
router.post('/register', controller.PostRegister)

module.exports = router