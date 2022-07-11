const jwt = require("jsonwebtoken")
const userModel = require('../models/userModel')
const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-Api-key"]
        if (!token) token = req.headers["x-api-key"]
        if (!token) {
            return res
                .status(400)
                .send({ status: false, message: "Token must be present" })
        }
        let decodedToken = jwt.verify(token, 'book-management-project')
        if (!decodedToken) {
            return res
                .status(401)
                .send({ status: false, msg: "token is not valid" })
        }
        req.userLoggedIn = decodedToken.userId
        next()
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}

const authorization = async function (req, res, next) {
    try {
        let idFromBody = req.body.userId
        let loggedInUser = req.userLoggedIn
        let idFromParams = req.params.bookId

        if (idFromBody) {
            if (!mongoose.isValidObjectId(idFromBody)) {
                return res
                    .status(400)
                    .send({ status: false, messgae: "UserId is Invalid or not present" })
            }
            let checkUser = await userModel.findById(idFromBody)
            if (!checkUser) {
                return res
                    .status(404)
                    .send({ status: false, message: `${idFromBody} not exist in DB` })
            }
            if (loggedInUser != idFromBody) {
                return res
                    .status(403)
                    .send({ status: false, message: "Not AUTHORISED user from body" })
            }
            next()
        }

        if (idFromParams) {
            if (!mongoose.isValidObjectId(idFromParams)) {
                return res
                    .status(400)
                    .send({ status: false, messgae: "UserId is Invalid or not present" })
            }
            let checkUser = await bookModel.findById(idFromParams)
            if (!checkUser) {
                return res
                    .status(404)
                    .send({ status: false, message: `${idFromParams} not Found` })
            }
            let checkBookForUpdate = await bookModel.findOne({_id: idFromParams, userId: loggedInUser})
            if(!checkBookForUpdate){
                return res
                .status(403)
                .send({ status: false, message: "Not AUTHORISED user from params" })
            }
            next()
        }
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}
module.exports = { authentication, authorization }