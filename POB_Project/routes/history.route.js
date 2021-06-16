const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/auth.middleware')
const controller = require('../controller/history.controller')

router.get('/history-buy', authMiddleware.requireAuth, authMiddleware.justUser, controller.getOrderHistory) 

router.get('/history-buy-detail', authMiddleware.requireAuth, authMiddleware.justUser, controller.getOrderHistoryDetails) 

router.get('/history-sold', authMiddleware.requireAuth, authMiddleware.justUser, controller.getSoldHistory) 

router.get('/history-sold-detail', authMiddleware.requireAuth, authMiddleware.justUser, controller.getSoldHistoryDetails) 

module.exports = router