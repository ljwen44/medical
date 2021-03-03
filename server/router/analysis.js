const express = require("express")
const router = express.Router()
const uuid = require('uuid')
const Text = require('../model/textModel')
const User = require('../model/userModel')

router.get('/userTypeCompare', async(req, res) => {
    let docUser = await User.find({
        type: '医生'
    }).countDocuments()
    let user = await User.find({
        type: '普通用户'
    }).countDocuments()
    res.status(200).json({
        message: 'OK',
        data: [
            {
                name: '医生',
                value: docUser
            },
            {
                name: '普通用户',
                value: user
            }
        ]
    })
})

router.get('/textByUser', async(req, res) => {
    let docText = await Text.find({
        type: '医生'
    }).countDocuments()
    let userText = await Text.find({
        type: '普通用户'
    }).countDocuments()
    res.status(200).json({
        message: 'OK',
        data: [
            {
                name: '医生',
                value: docText
            },
            {
                name: '普通用户',
                value: userText
            }
        ]
    })
})

router.get('/getTextByLike', async(req, res) => {
    await Text.aggregate([
        {
            $lookup: {
                from: "users",
				localField: "uid",
				foreignField: "_id",
				as: "user"
            }
        },
        {
            $sort:{
                "like": -1
            }
        },  
        {
            $project: {
                "user.userName" : 1,
                "like": 1,
                "read": 1,
                "desc": 1,
                "title": 1,
                "time": 1
            }
        },
        {
            $limit: 5
        }
    ], (err, info) => {
        if(err) {
            res.status(500).json({
                message: '服务器错误,请稍后重试'
            })
            return
        }
        res.status(200).json({
            data: info
        })
    })
})

router.get('/getTextByRead', async(req, res) => {
    await Text.aggregate([
        {
            $lookup: {
                from: "users",
				localField: "uid",
				foreignField: "_id",
				as: "user"
            }
        },
        {
            $sort:{
                "read": -1
            }
        },  
        {
            $project: {
                "user.userName" : 1,
                "like": 1,
                "read": 1,
                "desc": 1,
                "title": 1,
                "time": 1
            }
        },
        {
            $limit: 5
        }
    ], (err, info) => {
        if(err) {
            res.status(500).json({
                message: '服务器错误,请稍后重试'
            })
            return
        }
        res.status(200).json({
            data: info
        })
    })
})

router.post('/getTextByMonth', async(req, res) => {
    let { ...params } = req.body
    let docObj = [], userObj = []
    await Text.aggregate([
        {
            $match: {
                time: {
                    $gte: String(new Date(params.startTime).getTime()),
                    $lte: String(new Date(params.endTime).getTime())
                },
                type: '医生'
            }
        },
        {
            $group: {
                _id: '$time',
                value : { 
                    $sum : 1 
                }
            }
        },
    ], (err, info) => {
        if(err) {
            console.log(err)
            res.status(200).json({
                message: '服务器错误，请稍后重试'
            })
            return 
        }
        if(info) {
            for(let i = 0; i < info.length; i++) {
                let time = new Date(Number(info[i]._id))
                let month = time.getMonth() + 1
                month = month < 10 ? '0' + month : month
                let day = time.getDate()
                day = day < 10 ? '0' + day : day
                info[i]._id = month + '-' + day
            }
            docObj = info
        }
    })
    await Text.aggregate([
        {
            $match: {
                time: {
                    $gte: String(new Date(params.startTime).getTime()),
                    $lte: String(new Date(params.endTime).getTime())
                },
                type: '普通用户'
            }
        },
        {
            $group: {
                _id: '$time',
                value : { 
                    $sum : 1 
                }
            }
        },
    ], (err, info) => {
        if(err) {
            console.log(err)
            res.status(200).json({
                message: '服务器错误，请稍后重试'
            })
            return 
        }
        if(info) {
            for(let i = 0; i < info.length; i++) {
                let time = new Date(Number(info[i]._id))
                let month = time.getMonth() + 1
                month = month < 10 ? '0' + month : month
                let day = time.getDate()
                day = day < 10 ? '0' + day : day
                info[i]._id = month + '-' + day
            }
            userObj = info
        }
    })
    res.status(200).json({
        message: 'OK',
        docObj: docObj,
        userObj: userObj
    })
})

module.exports = router