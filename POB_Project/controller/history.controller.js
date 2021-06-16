const Order = require('../models/order.model')
const Bookshell = require("../models/bookshell.model")
const Book = require("../models/book.model")
const Account = require('../models/account.model')
const Currentuser = require('../controller/account.check')

module.exports.getOrderHistory = async (req, res) => {
    const { username } = req.user
    const account = await Account.findOne({ username })
    const userID = account.id
    const orders = await Order.find({userID : userID})
    res.render('layouts/user-history-buy', { orders : orders, username : account.username })
    return
}

module.exports.getSoldHistory = async (req, res) => {
    const { username } = req.user
    const account = await Account.findOne({ username })
    const userID = account.id
    const booksold = await Bookshell.find({userId : userID})
    res.render('layouts/user-history-sold',  { booksold : booksold, username : account.username })
    return
}

module.exports.getOrderHistoryDetails = async (req, res) => {
    const acc = await Currentuser.getCurrentUser(req, res)
    if (req.query.id == undefined) {
        res.redirect('/history-buy')
    } else {
        const order = await Order.findById(req.query.id)
        const result = []
        const books =  order.bookID;

        if (books.length==0) {
            res.redirect('/history-buy')
        } else {
            for (let i = 0; i < books.length; i++) {

                const book = await Book.findById(books[i])
                result.push( { name : book.bookName, count : order.count[i], price : book.price} )
            }

        }


        res.render('layouts/user-history-buy-detail', { data : { array : result, status: order.status }, username : acc })
        return
    }
}

module.exports.getSoldHistoryDetails = async (req, res) => {
    const acc = await Currentuser.getCurrentUser(req, res)
    if (req.query.id == undefined) {
        res.redirect('/history-sold')
    } else {
        const booksold = await Bookshell.findById(req.query.id)

        res.render('layouts/user-history-sold-detail', { booksold : booksold, username : acc })
        return
    }
}