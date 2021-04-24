const express = require('express')
const router = express.Router()

const controller = require('../controller/bookshell.controller')

const authMiddleware = require('../middlewares/auth.middleware')

// GET requests just for admin
router.get('/book-accept', authMiddleware.requireAuth, authMiddleware.isAdmin, authMiddleware.isAdmin, controller.getIncreaseBookBD)

// POST requests just for admin
router.post('/book-accept', authMiddleware.requireAuth, authMiddleware.isAdmin, authMiddleware.isAdmin, controller.postIncreaseBookBD)

// GET requests
router.get('/book-sell-by-user', authMiddleware.requireAuth, authMiddleware.justUser, controller.getBookshell)

// POST requests
router.post('/book-sell-by-user', authMiddleware.requireAuth, authMiddleware.justUser, controller.postBookshell)

module.exports = router