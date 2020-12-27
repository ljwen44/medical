const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const uuid = require('uuid')
const Sys = require('../model/sysModel')

router.get('/getSysByID', async(req, res) => {
    let uid = req.query.uid
    await Sys.find({uid}).sort({time: -1}).exec((err, info) => {
        if(err){
            res.status(500).json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        res.status(200).json({
            message: "OK",
            sys: info
        })
    })
})

module.exports = router
