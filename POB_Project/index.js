require('dotenv').config() //một biến môi trường dùng để bảo mật các thông tin quan trọng như username, password, url database,...

// Dependencies
const express = require('express') //framework dành cho nodejs 
const app = express()
const mongoose = require('mongoose') //import mongoose để kết với mongodb
const path = require('path') //hỗ trợ truy cập các tập hoặc cái đường dẫn thư mục
const cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')

// nhập tuyến đường
const authRouter = require('./routes/auth.route')
const bookRouter = require('./routes/book.route')
const booksellRouter = require('./routes/booksell.route')
const orderRouter = require("./routes/order.route")
const statisRouter = require("./routes/statis.route")
const historyRouter = require("./routes/history.route")
const adminRouter = require('./routes/admin.route')

// Import middlewares
const authMiddleware = require('./middlewares/auth.middleware')

// Session config
app.use(cookieParser(process.env.SECRET))
app.use(cookieSession({
    name: 'session',
    secret: process.env.SECRET,
    maxAge: 3 * 60 * 60 * 1000 // 3 hours
}))

//kết nối mongoDB atlas
mongoose.connect(process.env.MONGO_URL , {useNewUrlParser: true, useUnifiedTopology: true})
        .then(data => console.log(`Connect database successful!`))
        .catch(err => console.log(`Cannot connect database!`));

//Sử dụng tất cả file trong thư mục public, dùng để chứ những file css
app.use('/static', express.static(path.join(__dirname, 'public')))

//Thiết lập template engine pug
app.set('views', path.join(__dirname, 'views-new'))
app.set('view engine', 'pug')

// Config general
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use(authMiddleware.checkCookies)
app.use('/', authRouter)
app.use('/', orderRouter)
app.use('/', statisRouter)
app.use('/', bookRouter)
app.use('/', historyRouter);
app.use('/', booksellRouter)
app.use('/', orderRouter)
app.use('/', adminRouter)

app.listen(process.env.PORT || 3000 , () => console.log(`Listening on port ${process.env.PORT}`))
