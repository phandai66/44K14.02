const express = require('express')
const router = express.Router()

const controller = require('../controller/book.controller')

const authMiddleware = require('../middlewares/auth.middleware')

// GET requests

// POST requests

// GET request just for admin
router.get('/create-book', authMiddleware.requireAuth, authMiddleware.isAdmin, authMiddleware.isAdmin, controller.getNewBook)
router.get('/book-manager', authMiddleware.requireAuth, authMiddleware.isAdmin, authMiddleware.isAdmin, controller.getBooksForEdit)
router.get('/book-manager-details', authMiddleware.requireAuth, authMiddleware.isAdmin, authMiddleware.isAdmin, controller.getBooksDetailsForEdit)

// POST requests just for admin
router.post('/create-book', authMiddleware.requireAuth, authMiddleware.isAdmin, authMiddleware.isAdmin, controller.postNewBook)
router.post('/book-manager-details', authMiddleware.requireAuth, authMiddleware.isAdmin, authMiddleware.isAdmin, controller.postUpdateBook)

module.exports = router