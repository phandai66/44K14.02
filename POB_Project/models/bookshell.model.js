const mongoose = require('mongoose')
const Schema = mongoose.Schema

const booksellerSchema = new Schema({
    bookId: {
        type : String,
        required : true
    },
    userId:{
        type: String
    },
    bookName: {
        type : String,
        required : true
    },
    count : {
        type: Number,
        required: true
    },
    status : {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Booksell', booksellerSchema, 'booksell')