const express = require('express')
const router = express.Router()

const controller = require('../controller/admin.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/admin', authMiddleware.requireAuth, authMiddleware.isAdmin, controller.loadAdminPage)

module.exports = router