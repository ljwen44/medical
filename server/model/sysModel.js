const mongoose = require("mongoose")
const Schema = mongoose.Schema

const sys = new Schema({
    sid: {
        type: Schema.Types.ObjectId
    },
    uid: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    time: {
        type: String
    },
    desc: {
        type: String
    },
    isRead: {
        type: String,
        default: 0
    }
})

const Sys = mongoose.model('syss', sys)

module.exports = Sys