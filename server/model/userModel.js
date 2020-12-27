const mongoose = require("mongoose")
const Schema = mongoose.Schema

const user = new Schema({
    uid: {
        type: Schema.Types.ObjectId
    },
    userName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'public/images/default1.jpg'
    },
    online: {
        type: Number
    },
    IDpass: {
        type: String
    },
    auth: {
        type: Number,
        default: 0
    },
    bir: {
        type: String
    },
    work: {
        type: String,
    },
    job: {
        type:String,
    },
    sex: {
        type: String,
        default: "-"
    },
    introduce: {
        type: String,
        default: ''
    },
    fans: {
        type: Number,
        default: 0
    },
    focus: {
        type: Number,
        default: 0
    },
    authStatus: {
        type: Number,
        default: 1
    }
})

const User = mongoose.model('users', user)

module.exports = User