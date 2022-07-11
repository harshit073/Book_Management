const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: "Book",
        required: true
    },
    reviewedBy: {                   // value: reviewer's name
        type: String,
        required: true,
        default: 'Guest'
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        minlength: 1,
        maxlength: 5,
        required: true
    },
    review: {                       // optional
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
},{timeStamps: true})


module.exports = mongoose.model('review', reviewSchema)

// {
//     bookId: {ObjectId, mandatory, refs to book model},
//     reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
//     reviewedAt: {Date, mandatory},
//     rating: {number, min 1, max 5, mandatory},
//     review: {string, optional}
//     isDeleted: {boolean, default: false},
//   }