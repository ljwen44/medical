const mongoose = require("mongoose")
const Schema = mongoose.Schema

const comment = new Schema({
    cid: {
        type: Schema.Types.ObjectId
    },
    tid: {
        type: Schema.Types.ObjectId,
        refs: "texts"
    },
    uid: {
        type: Schema.Types.ObjectId,
        refs: "users"
    },
    desc: {
        type: String
    },
    time: {
        type: String
    }
})

const Comment = mongoose.model('comments', comment)

module.exports = Comment