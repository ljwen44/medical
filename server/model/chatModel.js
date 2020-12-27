const mongoose = require("mongoose")
const Schema = mongoose.Schema

const chat = new Schema({
    chid: {
        type: Schema.Types.ObjectId
    },
    // 发送方
    uid: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    // 接收方
    ruid: {
    	type: Schema.Types.ObjectId,
        ref: "users"
    },
    desc: {
        type: String
    },
    time: {
        type: String
    },
    isRead: {
        type: Number,
        default: 0
    }
})

const Chat = mongoose.model('chats', chat)

module.exports = Chat