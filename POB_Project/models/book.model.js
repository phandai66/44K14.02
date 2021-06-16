const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
    bookName: {
        type : String,
        required : true,
        unique: true
    },
    price : {
        type: Number,
        default: 0
    },
    image : {
        type: String
    },
    count : {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Book', bookSchema, 'book')