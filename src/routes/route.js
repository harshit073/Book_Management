const express = require('express')
const router = express.Router()

const {createUser, userLogIn} = require('../controllers/userController')
const {createBook, getBooks, getBooksById,updateById, deleteById} = require('../controllers/bookControllers')
const {addReview, updateReview, deleteReview} = require('../controllers/reviewControllers')

const {authentication, authorization }= require('../middleware/auth')


router.post("/register", createUser)
router.post("/login", userLogIn)

router.post("/books", authentication,  authorization, createBook)
router.get("/books", authentication, getBooks) 
router.get("/books/:bookId", authentication, getBooksById)
router.put("/books/:bookId", authentication,  authorization, updateById)
router.delete("/books/:bookId",authentication,  authorization, deleteById)

router.post("/books/:bookId/review", addReview)
router.put("/books/:bookId/review/:reviewId", updateReview)
router.delete("/books/:bookId/review/:reviewId", deleteReview)


module.exports = router;