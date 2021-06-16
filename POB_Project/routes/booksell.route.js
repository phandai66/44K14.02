const express = require('express')
const router = express.Router()

const controller = require('../controller/bookshell.controller')

const authMiddleware = require('../middlewares/auth.middleware')

// GET requests just for admin
router.get('/book-accept', authMiddleware.requireAuth, authMiddleware.isAdmin, controller.getIncreaseBookBD) 
router.get('/delete-book-sell/:id', authMiddleware.requireAuth, authMiddleware.isAdmin, controller.deleteBookSellById) 

// POST requests just for admin
router.post('/book-accept', authMiddleware.requireAuth, authMiddleware.isAdmin, controller.postIncreaseBookBD) 

// GET requests
router.get('/book-sell-by-user', authMiddleware.requireAuth, authMiddleware.justUser, controller.getBookshell)

// POST requests
router.post('/book-sell-by-user', authMiddleware.requireAuth, authMiddleware.justUser, controller.postBookshell)

module.exports = router