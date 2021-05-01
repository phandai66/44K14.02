const Book = require("../models/book.model")
const Order = require('../models/order.model')
const Currentuser = require('../controller/account.check')
const accountModel = require("../models/account.model")  //hai cái này như nhau, đều dẫn đến account.model.js
const Account = require('../models/account.model')

//Admin thêm sách mới vào giỏ shop
module.exports.postNewBook = async (req, res) => {
    const { bookName, price, image, count } = req.body
    const book = new Book({ bookName, price, image, count });
    await book.save()
    const acc = await Currentuser.getCurrentUser(req, res)

    //TODO Redirect dummy
    res.redirect('/book-manager')
}

//Load trang thêm sách mới
module.exports.getNewBook = async (req, res) => {
    if (req.user) { //nếu như đã đăng nhập
        const { username } = req.user   //hai dòng này lấy ra người dùng đang đăng nhập
        const acc = await Account.findOne({ username })
        res.render('layouts/book-form-new', { username : acc.username }) //render view book-form-new.js đồng thời truyền đến username đang đăng nhập
        return
    } else { //nếu như chưa đăng nhập
        res.redirect('/login') //thì truyền thằng đến page login
    }
}

//Load hết sách trong db ra
module.exports.getBooks = async(req, res) => {

    //Tạo đại để kiểm tra
    // const day = Date.parse('2021-04-23');
    // const order = new Order();
    // order.userID = 'xyz'
    // order.bookID = ['6078ed6aa78c6f3f1858f0ba','6078d2bb42ce2624f076da08', '6078c3de9a85fe1dc0d4cc92']
    // order.count = [3, 4, 6]
    // order.date = day;
    // await order.save();

    if (req.query.id == undefined) {
        const books = await Book.find( {})
        render(res, books)
    } else {
        const book = await Book.findById(req.query.id)
        const books = []
        books.push(book)
        render(res, books)
    }
}

const render = function (res, books) {
    if (books != null) {
        res.render('layouts/book-from-db', { books : books})
    }
}

module.exports.findAll = async (req, res) => {
    const { username } = req.signedCookies
    const page = parseInt(req.query.page) || 1
    const perPage = 8
    const start = (page - 1) * perPage
    const end = page * perPage
    const books = await Book.find()
    let pageNumber = 1;
    if (books.length > perPage) {
        pageNumber = (page / perPage) + 1
    }
    const pages = []
    for (let i = 0; i < pageNumber; i++) {
        pages[i] = i + 1
    }
    if (username) {
        res.render('layouts/bookshop', { books: books.slice(start, end), pages: pages , username : username  })
    } else {
        res.render('layouts/bookshop', { books: books.slice(start, end), pages: pages })
    }
}

module.exports.getBooksForEdit = async (req, res) => {
    const acc = await Currentuser.getCurrentUser(req, res)
    const books = await Book.find({})
    res.render('layouts/book-manager', { books : books, username : acc})
    return
}

module.exports.getBooksDetailsForEdit = async (req, res) => {
    const acc = await Currentuser.getCurrentUser(req, res)
    if (req.query.id == undefined) {
        res.redirect('/book-manager')
    } else {
        const book = await Book.findById(req.query.id)
        res.render('layouts/book-manager-details', { book : book, username : acc })
        return
    }
}

//Chỉnh sửa sách bởi Admin
module.exports.postUpdateBook = async (req, res) => {
    await Book.findByIdAndUpdate(req.body.id, { bookName : req.body.bookName, price : req.body.price, image : req.body.image}) //req.body.abcxyz là cái mà admin nhập ở giao diện
    res.redirect('/book-manager')
    return
}

module.exports.getBookById = async (req, res) => {
    let acc = null
    if (req.user) {
        const { username } = req.user
        acc = await Account.findOne({ username })
    }
    
    if (req.query.id == undefined) {
        res.redirect('/index')
    } else {
        const book = await Book.findById(req.query.id)
        // const array = []
        // array.push(book)
        if (acc) {
            res.render('layouts/book-detail', { book: book, username : acc.username })
            return
        } else {
            res.render('layouts/book-detail', { book: book })
            return
        }
    }
}

//Tìm kiếm
module.exports.getBookByName = async (req, res) => {
    if (req.query.name == undefined) {
        res.redirect('/index') //nếu không nhập gì mà bấm tìm kiếm thì redirect /index
    } else {
        const books = await Book.find({ bookName: { $regex: req.query.name, '$options': 'i' } }) //$regex ghi định dạng của name, $options': 'i' nghĩa là không phân biệt hoa thường
        if (req.user) {
            const { username } = req.user //tương đương const username = req.user.username
            const acc = await accountModel.findOne({ username })
            res.render('layouts/bookshop', { books: books, username: acc.username })
            return
        }
        res.render('layouts/bookshop', { books: books })
        return
    }
}

module.exports.showMainPage = async (req, res) => {
    if (!req.user) {
        res.render('layouts/main')
        return
    }
    const { username } = req.user
    res.render('layouts/main', { username })
    return
}

module.exports.getBooksDetailsByName = async (req, res) => {
    const { username } = req.user
    const acc = await accountModel.findOne({ username })
    if (req.query.name == '') {
        res.redirect('/admin')
    } else {
        const books = await Book.find({bookName : {$regex: req.query.name, '$options' : 'i'}})
        res.render('layouts/book-manager-details-by-name', { books : books,  username : acc.username })
        return
    }
}