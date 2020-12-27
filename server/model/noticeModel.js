const mongoose = require("mongoose")
const Schema = mongoose.Schema

const notice = new Schema({
    nid: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String
    },
    desc: {
        type: String
    },
    time: {
        type: String
    }
})

const Notice = mongoose.model('notices', notice)

module.exports = Notice