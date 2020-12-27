const mongoose = require("mongoose")
const Schema = mongoose.Schema

const text = new Schema({
    tid: {
        type: Schema.Types.ObjectId
    },
    uid: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        require: true,
    },
    desc: {
        type: String,
        require: true
    },
    type: {
        type: String,
        default: ''
    },
    like: {
        type: Number,
        default: 0
    },
    time: {
        type: String
    },
    reply: {
        type: Number,
        default: 0
    },
    read: {
        type: Number,
        default: 0
    }
})

const Text = mongoose.model('texts', text)

module.exports = Text