const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const uuid = require('uuid')
const Text = require('../model/textModel')
const User = require('../model/userModel')
const Comment = require('../model/commentModel')
const Notice = require('../model/noticeModel')

// 添加文章
router.post('/addText', async(req, res) => {
	let {...params} = req.body
	let text = new Text({
		title: params.title,
		desc: params.desc,
		uid: params._id,
		time: new Date().getTime(),
        type: params.type
	})
	await text.save((err, info) => {
        if(err){
            res.status(400).json({
                message: "添加失败，请刷新重试！"
            })
            return 
        }
        res.status(200).json({
            message: "OK"
        })
    })
})

// 获取用户发表的文章
router.get('/getText', async(req, res) => {
    let uid = req.query.uid
    await Text.find({uid}).sort({time: -1}).exec((err, info)=>{
        if(err){
            res.status(500).json({
                message: "获取信息失败，请稍后重试！"
            })
        } else {
            res.status(200).json({
                message: "OK",
                data: info
            })
        }
    })
})

// 根据_id获取文章
router.post('/getTextByID', async(req, res)=>{
    let {...params} = req.body
    Text.findOneAndUpdate({_id: params._id}, {$inc: {read:1}}, (err, info)=>{
        if(err){
            res.status(500).json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        User.findOne({_id: params.uid}, {password: 0}, (err1, info1) => {
            if(err){
                res.status(500).json({
                    message: "服务器错误，请稍后重试！"
                })
                return 
            }
            res.status(200).json({
                message: "OK",
                user: info1,
                text: info
            })
        })
    })
})

// 首页tab标签数据
router.post("/getTextByType", async(req, res) => {
    let {...params} = req.body
    // type的类型
    // lastest: 获取最新的数据，按时间排序
    // hot： 按点赞数量排序
    // focus： 条件查询关注的人发表的文章
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
            $sort: {
                time: -1
            }
        },
        {
            $skip: (params.page - 1)*10
        },
        {
            $limit: 10
        },
        {
            $project: {
                "user.password": 0,
            }
        }
    ], (err, info) => {
        if(err){
            res.status(500).json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        switch(params.type){
            case "lastest":
                info.sort((a, b) => {
                    return b.time - a.time
                })
                break
            case "hot":
                info.sort((a, b) => {
                    return b.like - a.like
                })
                break
            default:
                break
        }
        res.status(200).json({
            message: "OK",
            list: info
        })
    })
})

// 更多：通过类型判断获取相应的数据
router.post("/getMoreByType", async(req, res) => {
    let {...params} = req.body
    let text
    switch(params.type){
        case 'hot':
            await Text.find({})
                    .sort({like: -1, time: -1})
                    .skip((params.page-1)*10)
                    .limit(10)
                    .exec((err, info) => {
                        if(err){
                            res.status(500).json({
                                message: "服务器错误，请稍后重试！"
                            })
                            return 
                        }
                        text = info
                    })
            break
        case 'recommend':
            await Text.find({})
                    .sort({read: -1, time: -1})
                    .skip((params.page-1)*10)
                    .limit(10)
                    .exec((err, info) => {
                        if(err){
                            res.status(500).json({
                                message: "服务器错误，请稍后重试！"
                            })
                            return 
                        }
                        text = info
                    })
            break
        case 'information':
            await Text.find({type: '医生'})
                    .sort({time: -1})
                    .skip((params.page-1)*10)
                    .limit(10)
                    .exec((err, info) => {
                        if(err){
                            res.status(500).json({
                                message: "服务器错误，请稍后重试！"
                            })
                            return 
                        }
                        text = info
                    })
            break
        default: 
            break
    }
    await Text.find({}, (err, info) => {
        if(err){
            res.status(500).json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        res.status(200).json({
            text: text,
            total: info.length,
            message: "OK"
        })
    })
})

// 首页导航栏数据
router.get("/getNavData", async(req, res) => {
    let hot, recommend, information, notice
    await Text.find({}).sort({like:-1}).limit(5)
    .then(res1 => {
        hot = res1
        Text.find({}).sort({read:-1}).limit(5)
        .then(res2 => {
            recommend = res2
            Text.find({type: "医生"}).sort({time:-1}).limit(5)
            .then(res3 => {
                information = res3
                Notice.find({}).sort({time:-1}).limit(5)
                .then(res4 => {
                    notice = res4
                    res.status(200).json({
                        message: "OK",
                        hot: hot,
                        recommend: recommend,
                        information: information,
                        notice: notice
                    })
                })
            })
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            message: "服务器错误，请稍后重试！"
        })
    })
    
})

// 文章点赞
router.post("/addLike", async(req, res) => {
    let tid = req.body._id
    Text.updateOne({_id: tid}, {$inc: {like: 1}},(err, info) => {
        if(err){
            res.status(500).json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        res.status(200).json({
            message: "OK",
            info: info
        })
    })
})

// 删除文章
router.post("/delText", async(req, res) => {
    let { ...params } = req.body
    await Text.deleteOne({
        _id: params.tid
    }, (err, info) => {
        if(err){
            res.status(500).json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        Comment.deleteMany({
            tid: params.tid
        }, (err1, info1) => {
            if(err1){
                res.status(500).json({
                    message: "服务器错误，请稍后重试！"
                })
                return 
            }
            res.status(200).json({
                message: "OK"
            })
        })
    })
})

// 搜索文章
router.post("/getTotalBySearch", async(req, res) => {
    let {...params} = req.body
    await Text.find({
        title: {$regex: params.title}
    }).then(result => {
        res.status(200).json({
            message: "OK",
            total: result.length
        })
    }).catch(err => {
        res.status(500).json({
            message: "获取信息失败，请稍后重试！"
        })
    })
})

// 搜索内容
router.post("/getTextBySearch", async(req, res) => {
    let {...params} = req.body
    let total = await Text.find({

    })
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
            $match:{
                title: {$regex: params.title}
            }
        },
        {
            $sort: {
                time: -1
            }
        },
        {
            $skip: (params.page - 1)*10
        },
        {
            $limit: 10
        },
        {
            $project: {
                "user.password": 0
            }
        }
    ]).then(result => {
        res.status(200).json({
            message: "OK",
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "获取信息失败，请稍后重试！"
        })
    })
})

module.exports = router
