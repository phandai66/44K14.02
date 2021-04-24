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
        default: 'user'
    }
})

module.exports = mongoose.model('Account', accountSchema, 'account')