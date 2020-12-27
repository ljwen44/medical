const mongoose = require("mongoose")
const Schema = mongoose.Schema

const banner = new Schema({
    bid: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String
    },
    desc: {
        type: String
    },
    img: {
        type: String
    },
    time: {
        type: String
    }
})

const Banner = mongoose.model('banners', banner)

module.exports = Banner