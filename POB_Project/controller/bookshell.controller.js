const Bookshell = require("../models/bookshell.model")
const Book = require("../models/book.model")
const Account = require('../models/account.model')
const Currentuser = require('../controller/account.check')

// lấy sách cần thua mua
module.exports.getBookshell = async (req, res) => {
    // const book = await Book.findById(req.query.id)
    const acc = await Currentuser.getCurrentUser(req, res)
    const books = await Book.find({});
    res.render('layouts/book-shell', { books : books, username : acc })
}

// gửi đơn yêu cầu admin mua
module.exports.postBookshell = async (req, res) => {
    const book = await Book.findById(req.body.bookId);
    const bookshell = new Bookshell();

    //TODO Dummy userID here
    const { username } = req.user
    const account = await Account.findOne({ username })
    const userID = account.id
    bookshell.userId = userID
    bookshell.bookId = req.body.bookId;
    bookshell.bookName = book.bookName;
    bookshell.count = req.body.count;
    bookshell.status = false;
    await bookshell.save();

    //TODO Dummy render to test
    res.redirect('/index')
    return
}

//load vào trang sách phê duyệt để tăng số lượng trong db
module.exports.getIncreaseBookBD = async (req, res) => {
    const acc = await Currentuser.getCurrentUser(req, res)
    const bookshell = await Bookshell.find({ status : false })
    const listBookSell = []
    for (let i = 0; i < bookshell.length; i++) {
        const account = await Account.findById(bookshell[i].userId)
        listBookSell.push({ id: bookshell[i].id, bookId: bookshell[i].bookId, bookName: bookshell[i].bookName,
                            count: bookshell[i].count, userSold: account.username, userPhone: account.phone })
    }
    // console.log(bookshell)
    res.render('layouts/book-update-from-bookshell', { bookshell : listBookSell, username : acc})
}

//cập nhật sách trong db
module.exports.postIncreaseBookBD = async (req, res) => {
    // console.log('bookId ' + req.body.bookId)
    // console.log('id don hang ' + req.body.id)
    // console.log('count ' + req.body.count)
    const book = await Book.findById(req.body.bookId)
    book.count += parseInt(req.body.count)
    await Book.updateOne({_id : req.body.bookId}, book)


    const bookshell = await Bookshell.findById(req.body.id)
    bookshell.status = true;
    await Bookshell.updateOne({_id : req.body.id}, bookshell)


    //TODO redirect dummy here
    res.redirect('/admin')
}

module.exports.deleteBookSellById = async (req, res) => {
    const id = req.params.id
    const bookshell = await Bookshell.findById(id)
    await Bookshell.findOneAndDelete({ _id: bookshell._id })
    res.redirect('/book-accept')
    return;
}