const express = require('express') // require express framework- http request
var bodyParser = require('body-parser')// bodyparser package global middleware
const mongoose = require('mongoose')// intermediary package b/w nodejs & DB
const route = require('./routes/route')// import route to connect to server


const app = express()// instance of express in app variable

app.use(bodyParser.json())// jason to convert the body data to json

mongoose.connect("mongodb+srv://harshit073:BKiK0IK7mxwwDBu0@cluster0.f11hm.mongodb.net/Project-3-harshit-DB",
    {
        useNewUrlParser: true,
    }
)
.then(() => console.log("MongoDb connected"))
.catch((err) => console.log(err));

app.use('/', route)

app.listen(process.env.PORT || 3000, function () {
    console.log("Express app running on port " + (process.env.PORT || 3000));
});