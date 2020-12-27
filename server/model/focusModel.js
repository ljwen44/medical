const mongoose = require("mongoose")
const Schema = mongoose.Schema

const focu = new Schema({
    fid: {
        type: Schema.Types.ObjectId
    },
    // 关注的用户
    uid: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    // 被关注的用户
    cuid: {
    	type: Schema.Types.ObjectId,
        ref: "users"
    },
    time: {
        type: String
    }
})

const Focu = mongoose.model('focus', focu)

module.exports = Focu