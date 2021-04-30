const Order = require('../models/order.model')
const Account = require('../models/account.model')
const Book = require('../models/book.model')
const Basket = require('../models/basket.model')
const Currentuser = require('../controller/account.check')

module.exports.insertIntoBasket = async (req, res) => {
    const id = req.params.id
    const { username } = req.user 
    const account = await Account.findOne({ username })
    const book = await Book.findById(id)
    const basket = await Basket.findOne({ userID: account.id })
    if (book.count <= 0 || book.count <= basket.count[basket.bookID.indexOf(id)]) {
        const messages = []
        messages.push('Số lượng trong kho không đủ')
        const baskets = []
        if (!basket) {
            res.render('layouts/basket', { username : acc })
            return
        }
        const bookArr = basket.bookID
        const countArr = basket.count
        for (let i = 0; i < bookArr.length; i++) {
            const book = await Book.findById(bookArr[i])
            
            baskets.push({ stt: i + 1, bookId: book.id, bookName: book.bookName, quantity: countArr[i], price: book.price  * countArr[i] })
        }
        if (bookArr.length == 0) {
            basket.status = 'empty'
        }
        res.render('layouts/basket', { orders: baskets, status: basket.status, total: basket.total, orderID: basket.orderID, username : account.username, messages: messages })
        return
    } else {
        if (!basket) {
            const bookArr = [id];
            const countArr = [1];
            // TODO: need to add date
            const newBasket = new Basket({ userID: account.id, bookID: bookArr, count: countArr, total: book.price, status: 'in basket', date : date() })
            await newBasket.save()
            res.redirect('/cart')
        } else {
            const index = basket.bookID.indexOf(id)
            if (index == -1) {
                basket.bookID.push(id)
                basket.count.push(1)
                basket.total = basket.total + book.price
            } else {
                let idx = basket.bookID.indexOf(id)
                let itemCount = basket.count[basket.bookID.indexOf(id)]
                basket.count[idx] = itemCount + 1
                basket.total = basket.total + book.price
            }
            basket.status = 'in basket'
            basket.date = date()
            // TODO: need add date
            await Basket.updateOne({ userID: account.id }, basket)
            res.redirect('/cart')
        }
    }
}

module.exports.removeItem = async (req, res) => {
    const id = req.params.id
    const { username } = req.user

    const account = await Account.findOne({ username })
    const book = await Book.findById(id)
    const basket = await Basket.findOne({ userID: account.id })

    const idx = basket.bookID.indexOf(id)
    let itemCount = basket.count[idx]
    if (itemCount <= 1) {
        basket.total = basket.total - book.price * basket.count[idx]
        basket.bookID.splice(idx, 1)
        basket.count.splice(idx, 1)
    } else {
        basket.total = basket.total - book.price
        basket.count[idx] = itemCount - 1
    }
    await Basket.updateOne({ userID: account.id }, basket)
    res.redirect('/cart')
}

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id
    const { username } = req.user

    const account = await Account.findOne({ username })
    const book = await Book.findById(id)
    const basket = await Basket.findOne({ userID: account.id })

    const idx = basket.bookID.indexOf(id)
    basket.total = basket.total - book.price * basket.count[idx]
    basket.bookID.splice(idx, 1)
    basket.count.splice(idx, 1)

    if (basket.bookID.length == 0) {
        basket.status = 'empty'
    }
    
    await Basket.updateOne({ userID: account.id }, basket)
    res.redirect('/cart')
}

//xem giỏ hàng
module.exports.showBasket = async (req, res) => {
    const acc = await Currentuser.getCurrentUser(req, res)
    const { username } = req.user
    const account = await Account.findOne({ username })
    const baskets = []

    const basket = await Basket.findOne({ userID: account.id })

    if (!basket) {
        res.render('layouts/basket', { username : acc })
        return
    }

    const bookArr = basket.bookID
    const countArr = basket.count

    for (let i = 0; i < bookArr.length; i++) {
        const book = await Book.findById(bookArr[i])
        
        baskets.push({ stt: i + 1, bookId: book.id, bookName: book.bookName, quantity: countArr[i], price: book.price  * countArr[i] })
    }
    if (bookArr.length == 0) {
        basket.status = 'empty'
    }
    res.render('layouts/basket', { orders: baskets, status: basket.status, total: basket.total, orderID: basket.orderID, username : acc })
    return
}

module.exports.cancelOrder = async (req, res) => {
    const orderID = req.params.orderID
    const order = await Order.findById(orderID)
    await Order.findByIdAndDelete({ _id: order._id })
    res.redirect('/order-pay')
}

module.exports.payOrder = async (req, res) => {
    const { username } = req.user
    const account = await Account.findOne({ username })
    const basket = await Basket.findOne({ userID: account.id })

    const order = new Order({ userID: basket.userID, bookID: basket.bookID, count: basket.count, date: date(), total: basket.total })
    await order.save()

    basket.status = 'empty'
    basket.bookID = []
    basket.count = []
    basket.total = 0
    await Basket.updateOne({ userID: account.id }, basket)
    res.redirect('/index')
}

module.exports.showOrderPayed = async (req, res) => {
    const { username } = req.user
    const account = await Account.findOne({ username })
    const orders = []
    const list = await Order.find({ userID: account.id })
    let stt = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i].status == 'pending') {
            const books = []
            for (let j = 0; j < list[i].bookID.length; j++) {
                const book = await Book.findById(list[i].bookID[j])
                books.push(book.bookName)
            }
            orders.push({ stt: ++stt, orderID: list[i].id, bookName: books, quantity: list[i].count, total: list[i].total })
        }
    }

    res.render('layouts/orderpay', { orders : orders, username : account.username })
    return
}

module.exports.showOrderManage = async (req, res) => {
    const { username } = req.user
    const acc = await Account.findOne({ username })
    const orders = []
    const listOrders = await Order.find({ status: 'pending' })
    for (let i = 0; i < listOrders.length; i++) {
        const account = await Account.findById(listOrders[i].userID)
        const books = []
        for (let j = 0; j < listOrders[i].bookID.length; j++) {
            const book = await Book.findById(listOrders[i].bookID[j])
            books.push(book.bookName)
        }
        orders.push({ stt: i + 1, orderId: listOrders[i].id, buyer: account.name, bookName: books, quantity: listOrders[i].count, total: listOrders[i].total, phone : account.phone })
    }

    res.render('layouts/acceptOrder', { orders : orders, username : acc.username })
    return
}

module.exports.acceptOrder = async (req, res) => {
    const id = req.params.id
    const order = await Order.findById(id)
    for (let i = 0; i < order.bookID.length; i++) {
        const book = await Book.findById(order.bookID[i])
        const idx = order.bookID.indexOf(order.bookID[i])
        book.count -= order.count[idx]
        await Book.updateOne({ _id: book._id }, book)
    }
    order.status = 'accept'
    const basket = await Basket.findOne({ userID: order.userID })
    basket.bookID = []
    basket.count = []
    basket.status = 'empty'
    basket.total = 0
    await Basket.updateOne({ _id: basket._id }, basket)
    await Order.updateOne({ _id: order._id }, order)
    res.redirect('/order-manage')
}

module.exports.rejectOrder = async (req, res) => {
    const id = req.params.id
    const order = await Order.findById(id)
    order.status = 'reject'
    await Order.updateOne({ _id: order._id }, order)
    const basket = await Basket.findOne({ userID: order.userID })
    basket.status = 'reject'
    await Basket.updateOne({ _id: basket._id }, basket)
    res.redirect('/order-manage')
}

const date = function () {
    let year = new Date().getFullYear()
    let abc = (new Date().getMonth() + 1).toString()
    let month =  abc.length == 1 ? '0' + abc : abc
    let day = new Date().getDate()

    let date = year + '-'+ month + '-' + day

    return date
}