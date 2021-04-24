const mongoose = require('mongoose')
const Schema = mongoose.Schema

const basketSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    bookID: {
        type: [String]
    },
    count: {
        type: [Number]
    },
    date: {
        type: Date
    },
    total: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'in basket'
    }
})

module.exports = mongoose.model('Basket', basketSchema, 'basket')