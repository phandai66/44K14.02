const express = require('express')
const router = express.Router()

const controller = require('../controller/order.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// GET requests
router.get('/add/:id', authMiddleware.requireAuth, authMiddleware.justUser, controller.insertIntoBasket)
router.get('/cart', authMiddleware.requireAuth, authMiddleware.justUser, controller.showBasket) //xem giỏ hàng
router.get('/remove/:id', authMiddleware.requireAuth, authMiddleware.justUser, controller.removeItem)
router.get('/delete/:id', authMiddleware.requireAuth, authMiddleware.justUser, controller.deleteItem)
router.get('/cancel/:orderID', authMiddleware.requireAuth, authMiddleware.justUser, controller.cancelOrder)
router.get('/pay', authMiddleware.requireAuth, authMiddleware.justUser, controller.payOrder)
router.get('/order-pay', authMiddleware.requireAuth, authMiddleware.justUser, controller.showOrderPayed)

// GET requests ( just for admin )
router.get('/order-manage', authMiddleware.requireAuth, authMiddleware.isAdmin, controller.showOrderManage)
router.get('/accept-order/:id', authMiddleware.requireAuth, authMiddleware.isAdmin, controller.acceptOrder)
router.get('/reject-order/:id', authMiddleware.requireAuth, authMiddleware.isAdmin, controller.rejectOrder)

module.exports = router