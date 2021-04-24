const Order = require('../models/order.model')
const Book = require("../models/book.model")
const Account = require('../models/account.model')

module.exports.getStatis = async (req, res) => {
    const { username } = req.user
    const acc = await Account.findOne({ username })
    if (req.query.type === undefined && req.query.value === undefined) {
        const result = new Map()
        const orders = await Order.find({status : 'accept'})
        const array = await statis(result, orders)
        res.render('layouts/statis-page', { array : array, username : acc.username })
    } else {
        if (req.query.type === 'day') {
            const day = new Date(req.query.value);

            const result = new Map()
            const orders = await Order.find({date : day})

            //console.log(orders)

            const array = await statis(result, orders)

            res.render('layouts/statis-page', { array : array, username : acc.username })

        } else if (req.query.type === 'month') {
            const result = new Map()
            const orders = await Order.find({})

            const year = req.query.value.substring(0,4)
            let month = req.query.value[5]=='0' ? req.query.value[6] : req.query.value.substring(5,7)
            month = parseInt(month) - 1
            month = month.toString()


            const list = []
            for (let i = 0; i < orders.length; i++) {

                if (orders[i].date.getMonth() == month && orders[i].date.getFullYear() == year) {
                    list.push(orders[i]);
                }
            }


            const array = await statis(result, list);
            res.render('layouts/statis-page', { array : array, username : acc.username })
        } else if (req.query.type === 'year') {

            const result = new Map()
            const orders = await Order.find({})

            const list = []
            for (let i = 0; i < orders.length; i++) {

                if (orders[i].date.getFullYear() == req.query.value) {
                    list.push(orders[i]);
                }
            }


            const array = await statis(result, list);
            res.render('layouts/statis-page', { array : array, username : acc.username })
        }

    }
}

const statis = async function (result, orders) {

    //Duệt qua các đơn hàng
    for (let order = 0; order < orders.length; order++) {

        const books = orders[order].bookID;
        const count = orders[order].count;

        //Duyệt qua các quyển sách và số lượng
        for (let book= 0; book < books.length; book++) {
            if (result.has(books[book])) {
                let sum = result.get(books[book]);
                sum.total += parseInt(count[book]);
                result.set(books[book], sum)
            } else {
                result.set(books[book], { total:  count[book]})
            }
        }
    }

    //Thêm tên sách và tính tổng tiền
    for (let [key, value] of result) {
        const book = await Book.findById(key)
        result.set(key, { totalPrice : book.price*parseInt(value.total), name : book.bookName, total : value.total })
    }

    const array = Array.from(result)
    return array;
}

