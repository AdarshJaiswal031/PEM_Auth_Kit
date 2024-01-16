const mongoose = require("mongoose")
require("dotenv").config()
const mongoUrl = "mongodb://localhost:27017/pem_auth_kit"
const connection = mongoose.createConnection(mongoUrl)

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    hash: {
        type: String,
        require: true,
    },
    salt: {
        type: String,
        require: true
    }
})

const User = connection.model('User', UserSchema)
module.exports = connection
