const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { isValidRequest, isValid,   isValidName, isValidMobile, isValidEmail, isValidPassword } = require('../validations/validations')

//================================Create User API====================================================
const createUser = async function (req, res) {
    try {
        if (!isValidRequest(req.body)) {// for empty body
            return res
                .status(400)
                .send({ status: false, message: "Enter the valid Input" })
        }
        let { title, name, phone, email, password } = req.body


        if (title) {
            if (!isValid(title)) {
                //console.log("in title")
                return res
                    .status(400)
                    .send({ status: false, message: "Enter the valid title" })
            }

        }
        else {
            return res
                .status(400)
                .send({ status: false, message: "title is required" })
        }

        if (name) {
            if (!isValid(name)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter the valid name" })
            }
            if (!isValidName(name)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter name in proper format" })
            }
        }
        else {
            return res
                .status(400)
                .send({ status: false, message: "name is required" })
        }

        if (phone) {
            if (!isValid(phone)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Properly Enter the valid phone" })
            }
            if (!isValidMobile(phone)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter phone in proper format" })
            }
        }
        else {
            return res
                .status(400)
                .send({ status: false, message: "phone is required" })
        }

        if (email) { //console.log(email)
            if (!isValid(email)) {
                //console.log(email)
                return res.status(400).send({ status: false, message: "Enter valid email" })
            }
            if (!isValidEmail(email)) {
                return res.status(400).send({ status: false, message: "enter valid format of email" })
            }
           
        }else {
            return res
                .status(400)
                .send({ status: false, message: "email is required" })
        }
        const check = await userModel.find({$or:[{email: email, phone:phone}]})
        if (!check) {
            return res
                .status(404)
                .send({
                    status: false, message: "email or phone already exists"
                })
        } 

        if (password) {
            if (!isValid(password)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter valid Password" })
            }
            if (!isValidPassword(password)) {
                return res
                    .status(400)
                    .send({ status: false, message: "password length is between 8 to 15" })
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "password is required" })
        }

        let saveDats = await userModel.create(req.body)

        return res
            .status(201)
            .send({ status: true, message: 'Success', data: saveDats })
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}

//================================User Login API====================================================

const userLogIn = async function (req, res) {
    try {
        if (!isValidRequest(req.body)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter the valid Input" })
        }
        let { email, password } = req.body
        if (email) {
            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: "Enter valid email" })
            }
            if (!isValidEmail(email)) {
                return res.status(400).send({ status: false, message: "enter valid format of email" })
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "email is required" })
        }

        if (password) {
            if (!isValid(password)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Enter valid Password" })
            }
            if (!isValidPassword(password)) {
                return res
                    .status(400)
                    .send({ status: false, message: "password length is between 8 to 15" })
            }
        } else {
            return res
                .status(400)
                .send({ status: false, message: "password is required" })
        }

        const login = await userModel.findOne({ email: email, password: password })
        if (!login) {
            return res
                .status(404)
                .send({ status: false, message: "No such user exist" })
        }

        const token = jwt.sign({
            userId: login._id.toString()
        },
            "book-management-project",
            { expiresIn: "24h" });

        return res
            .status(200)
            .send({ status: true, message: "Success", data: token })
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: false, message: err.message })
    }
}


module.exports = { createUser, userLogIn }