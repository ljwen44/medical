const mongoose = require("mongoose")
const Schema = mongoose.Schema

const exitData = new Schema({
    eid: {
        type: Schema.Types.ObjectId
    },
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    visit: {
        type: String,
        default: ''
    },
    watch: {
        type: String,
        default: ''
    },
    like: {
        type: String,
        default: ''
    },
    chat: {
        type: String
    }
})

const ExitData = mongoose.model('exitDatas', exitData)

module.exports = ExitData