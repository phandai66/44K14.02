const express = require('express')
const router = express.Router()

const controller = require('../controller/static.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/statis', authMiddleware.requireAuth, authMiddleware.isAdmin, controller.getStatis) 

module.exports = router