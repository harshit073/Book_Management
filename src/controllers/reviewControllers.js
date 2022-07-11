const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const mongoose = require('mongoose')

const { isValidRequest, isValid, isValidName } = require('../validations/validations')

const addReview = async function (req, res) {
    try {
        const idBook = req.params.bookId
        if (!mongoose.isValidObjectId(idBook)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter Valid BookId" })
        }

        let { reviewedBy, rating, review } = req.body
        console.log(req.body)

        if (!isValidRequest(req.body)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter the valid Input" })
        }
        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Provide valid reviewedBy" })
            }
            if (!isValidName(reviewedBy)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Guest name can't be in number" })
            }
        }

        if (rating) {
            if (!isValid(rating)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Provide valid reviewedBy" })
            }
            if (!(rating >= 1 && rating <= 5)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Ratings should be between 1 and 5" })
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "rating is required" })
        }

        if (!isValid(review)) {
            return res
                .status(400)
                .send({ status: false, message: "review should be string type" })
        }

        const checkIdBook = await bookModel.findOne({ _id: idBook, isDeleted: false }).select({ __v: 0 })
        if (!checkIdBook) {
            return res
                .status(404)
                .send({ status: false, message: "BookId Not Found" })
        }

        req.body.bookId = checkIdBook._id
        req.body.reviewedAt = new Date()


        const reviewData = await reviewModel.create(req.body)
        console.log(reviewData)

        if (reviewData) {
            await bookModel.updateOne({ _id: reviewData.bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true })
        }

        const reviewInBook = await reviewModel.find({ _id: reviewData._id }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        checkIdBook._doc.reviewsData = reviewInBook

        return res
            .status(200)
            .send({ status: true, message: "Success", data: checkIdBook })
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}


const updateReview = async function (req, res) {
    try {
        if (!isValidRequest(req.body)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter the valid Input" })
        }
        let id = req.params.bookId
        let reviewId = req.params.reviewId
        let { reviewedBy, rating, review } = req.body

        if (!mongoose.isValidObjectId(id) && !mongoose.isValidObjectId(reviewId)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter the valid book nd review Id" })
        }
        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Provide valid reviewedBy" })
            }
            if (!isValidName(reviewedBy)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Guest name can't be in number" })
            }
        }

        if (rating) {
            if (!isValid(rating)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Provide valid reviewedBy" })
            }
            if (!(rating >= 1 && rating <= 5)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Ratings should be between 1 and 5" })
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "rating is required" })
        }

        if (!isValid(review)) {
            return res
                .status(400)
                .send({ status: false, message: "review should be string type" })
        }
        const checkIdBook = await bookModel.findOne({ _id: id, isDeleted: false })
        if (!checkIdBook) {
            return res
                .status(404)
                .send({ status: false, message: "BookId Not Found" })
        }

        const checkReviewUpdate = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: id, isDeleted: false }, { $set: req.body }, { new: true })
        if (!checkReviewUpdate) {
            return res
                .status(404)
                .send({ status: false, message: "No data found with given  review Id" })
        }

        checkIdBook._doc.reviewData = checkReviewUpdate

        return res
            .status(200)
            .send({ status: false, message: "Success", data: checkIdBook })
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}

const deleteReview = async function (req, res) {
    try {
        let id = req.params.bookId
        let reviewId = req.params.reviewId

        if (!mongoose.isValidObjectId(id) && !mongoose.isValidObjectId(reviewId)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter the valid book and review Id" })
        }

        const checkIdBook = await bookModel.findOne({ Bookid: id, isDeleted: false })
        if (!checkIdBook) {
            return res
                .status(404)
                .send({ status: false, message: "BookId Not Found" })
        }
        const checkIdReview = await reviewModel.findById(reviewId)
        if (!checkIdReview) {
            return res
                .status(404)
                .send({ status: false, message: "review Not Found" })
        }

        const deleteData = await reviewModel.findOneAndUpdate({ bookId: id, _id: reviewId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (deleteData) {
            await bookModel.findOneAndUpdate({ _id: id }, { $inc: { reviews: -1 } })
        }

        return res
            .status(200)
            .send({ status: true, message: "Review deleted", data: deleteData })
       
    } catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}


module.exports = { addReview, updateReview, deleteReview }