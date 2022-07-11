const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')
const { isValidRequest, isValid, isValidName, isValidISBN, isValidDate, isValidTitle } = require('../validations/validations')
const reviewModel = require('../models/reviewModel')


//================================Create Book API====================================================
const createBook = async function (req, res) {
    try {
        if (!isValidRequest(req.body)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter the valid Input" })
        }
        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = req.body
        let saveData = {}
        if (title) {
            if (!isValid(title)) {
                return res
                    .status(400)
                    .send({ status: false, message: " enter valid title" })
            }
            if (!isValidTitle(title)) {
                return res
                    .status(400)
                    .send({ status: false, message: " Enter title from Mr, Mrs, Miss" })
            }
            const isAvailable = await bookModel.find({ title: title })
            if (isAvailable.length > 0) {
                return res
                    .status(400)
                    .send({ status: false, message: "title already available,use different one" })
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "title is required" })
        }

        if (excerpt) {
            if (!isValid(excerpt)) {
                return res
                    .status(400)
                    .send({ status: false, message: " enter valid excerpt" })
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "excerpt is required" })
        }

        if (userId) {
            if (!isValid(userId)) {
                return res
                    .status(400)
                    .send({ status: false, message: "userId needed in proper format" })
            }

            if (!mongoose.isValidObjectId(userId)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter Valid userId" })
            }

            const checkId = await userModel.find({ userId: userId })
            if (checkId.length == 0) {
                return res
                    .status(404)
                    .send({ status: false, message: 'No such user exist' })
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "userId is required" })
        }

        if (ISBN) {
            if (!isValid(ISBN)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter Valid ISBN" })
            }
            if (!isValidISBN(ISBN)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter Valid 10 or 13 digit ISBN" })
            }

            const uniqueISBN = await bookModel.find({ ISBN: ISBN, isDeleted: false })
            if (uniqueISBN.length > 0) {
                return res
                    .status(400)
                    .send({ status: false, message: "ISBN already available, use different one" })
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "ISBN is required" })
        }

        if (category) {
            if (!isValid(category)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter Valid category" })
            }
            if (!isValidName(category)) {
                return res
                    .status(400)
                    .send({ status: false, message: "enter Category in proper format " })
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "ISBN is required" })
        }

        if (subcategory != null) {
            console.log(typeof (subcategory))
            if (typeof (subcategory) == "object") {
                if (subcategory.length == 0) {
                    return res.status(400).send({ msg: "subcategory should not be empty" })
                }
                for (i = 0; i < subcategory.length; i++) {
                    if (typeof (subcategory[i]) != "string") {
                        return res.status(400).send({ msg: "subcategory should be array of string" })
                    } console.log(subcategory)
                    if (subcategory.toString().trim().length == 0) {
                        console.log("In Trim")
                        return res.status(400).send({ msg: " subcategory should not be blank after trim" })
                    }
                }
            } else {
                if (typeof (subcategory) != "string") {
                    return res.status(400).send({ msg: "subcategory should be string " })
                }
                if (subcategory.trim().length == 0) {
                    return res.status(400).send({ msg: " subcategory should not be blank" })
                }
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "subcategory is required" })
        }

        if (releasedAt) {
            if (!isValid(releasedAt)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter the releasedAt " })
            }
            if (!isValidDate(releasedAt)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter valid releasedAt " })
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "releaseAt is required" })
        }

        saveData = await bookModel.create(req.body)
        return res
            .status(201)
            .send({ status: true, message: 'Success', data: saveData })
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}

//================================Get Book API====================================================
const getBooks = async function (req, res) {
    try {
        if (!isValidRequest(req.query)) { // for empty body
            return res
                .status(400)
                .send({ status: false, message: "Provide the valid query" })
        }

        const { userId, category, subcategory } = req.query

        if (userId) {
            if (!isValid(userId)) {
                return res
                    .status(400)
                    .send({ status: false, message: "userId needed in proper format" })
            }

            if (!mongoose.isValidObjectId(userId)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter Valid userId" })
            }

            const checkId = await userModel.find({ userId: userId }) // for Uniqueness of userId
            if (checkId.length == 0) {
                return res
                    .status(404)
                    .send({ status: false, message: 'No such user exist' })
            }
        }

        if (category) {
            if (!isValid(category)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter Valid category" })
            }
            if (!isValidName(category)) {
                return res
                    .status(400)
                    .send({ status: false, message: "enter Category in proper format " })
            }
        }


        if (subcategory != null) {
            console.log(typeof (subcategory))
            if (typeof (subcategory) == "object") {
                if (subcategory.length == 0) {
                    return res.status(400).send({ msg: "subcategory should not be empty" })
                }
                for (i = 0; i < subcategory.length; i++) {
                    if (typeof (subcategory[i]) != "string") {
                        return res.status(400).send({ msg: "subcategory should be array of string" })
                    } console.log(subcategory)
                    if (subcategory.toString().trim().length == 0) {
                        console.log("In Trim")
                        return res.status(400).send({ msg: " subcategory should not be blank after trim" })
                    }
                }
            } else {
                if (typeof (subcategory) != "string") {
                    return res.status(400).send({ msg: "subcategory should be string " })
                }
                if (subcategory.trim().length == 0) {
                    return res.status(400).send({ msg: " subcategory should not be blank" })
                }
            }
        }

        const bookList = await bookModel.find({ $and: [req.query, { isDeleted: false }] }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 });
        if (bookList.length == 0) {
            return res
                .status(404)
                .send({ status: false, message: "No Books available" })
        }
        return res
            .status(200)
            .send({ status: true, message: 'Books List', data: bookList })
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}

//================================Create Book By Id API====================================================
const getBooksById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!mongoose.isValidObjectId(bookId)) {// how this function will work its not working
            return res
                .status(400)
                .send({ status: false, message: "Enter Valid bookId" })
        }

        let checkId = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({__v:0})
        if (!checkId) {
            return res
                .status(404)
                .send({ status: false, message: "Book not found" })
        }
        let checkReview = await reviewModel.find({ bookId: checkId._id, isDeleted: false })
        if (checkReview.length == 0) {
            checkId._doc.reviewsData = []
        } else {
            checkId._doc.reviewsData = checkReview
        }
        return res.status(200).send({ status: true, message: 'Books List', data: checkId })
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}

//================================Update Book API====================================================
const updateById = async function(req, res){
    try {
        let bookId = req.params.bookId
        if(bookId){
        if (!mongoose.isValidObjectId(bookId)) {// how this function will work its not working
            return res
                .status(400)
                .send({ status: false, message: "Enter Valid bookId" })
        }
    }else {
        return res
                .status(400)
                .send({ status: false, message: "BookId is required" })
    }
    if (!isValidRequest(req.body)) {
        return res
            .status(400)
            .send({ status: false, message: "Enter the valid Input" })
    }    
    
    let {title, excerpt, ISBN, releasedAt} = req.body
    if (title) {
        if (!isValid(title)) {
            return res
                .status(400)
                .send({ status: false, message: " enter valid title" })
        }
        const isAvailableTitle = await bookModel.findOne({ title: title, isDeleted: false  })
        if (isAvailableTitle) {
            return res
                .status(400)
                .send({ status: false, message: "title already available,use different one" })
        }
    } 

    if (excerpt) {
        if (!isValid(excerpt)) {
            return res
                .status(400)
                .send({ status: false, message: " enter valid excerpt" })
        }
    }

    if (ISBN) {
        if (!isValid(ISBN)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter Valid ISBN" })
        }
        if (!isValidISBN(ISBN)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter Valid 10 or 13 digit ISBN" })
        }

        const uniqueISBN = await bookModel.findOne({ ISBN: ISBN, isDeleted: false })
        if (uniqueISBN) {
            return res
                .status(400)
                .send({ status: false, message: "ISBN already available, use different one" })
        }
    } 

    if (releasedAt) {
        if (!isValid(releasedAt)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter the releasedAt " })
        }
        if (!isValidDate(releasedAt)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter valid releasedAt " })
        }
    }
    
    const updateData = await bookModel.findOneAndUpdate({_id: bookId, isDeleted: false},{ title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt }, { new: true })
    if(!updateData) {
        return res
        .status(404)
        .send({ status: false, message: "No book found with given Id" })
    }

    return res
    .status(200)
    .send({ status: true, message: "Success", data: updateData })
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}

//================================Delete Book API====================================================
const deleteById = async function(req, res){
    try {
        let idBook = req.params.bookId
        if (!mongoose.isValidObjectId(idBook)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter Valid bookId" })
        }
        const checkBookId = await bookModel.findOneAndUpdate({_id: idBook, isDeleted:false}, {$set: {isDeleted: true, deletedAt: new Date()}}, {new: true})
        if(!checkBookId){
            return res
            .status(404)
            .send({ status: false, message: "No book found with given Id to delete" })
        }

        return res
        .status(200)
        .send({ status: true, message: "Success in Deletion", data: checkBookId })
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}

module.exports = { createBook, getBooks, getBooksById, updateById, deleteById }