const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    class: {
        type: String
    },
    role: {
        type: String,
        default: 'user' //mặc định tài khoản tạo trên web là người mua/bán, tài khoản admin tạo ngay trong DB
    }
})

module.exports = mongoose.model('Account', accountSchema, 'account') //tên model, định dạng schema (kiểu dữ liệu, mặc định...), collection trong DB