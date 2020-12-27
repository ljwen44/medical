const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const uuid = require('uuid')
const fs = require('fs')
const Banner = require('../model/bannerModel')
const Text = require('../model/textModel')
const User = require('../model/userModel')
const Notice = require('../model/noticeModel')
const Comment = require('../model/commentModel')
const Sys = require('../model/sysModel')
const upload = 'public/images/'

const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10)

// 获取管理员数据
router.post("/getAdminData", async(req, res) => {
    let _id = req.body.uid
    await User.findOne({
        _id: _id
    }, {
        password: 0
    }, (err, info) => {
        if(err){
            res.status.json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        res.status(200).json({
            message: "OK",
            user: info
        })
    })
})
// 修改密码
router.post("/updAdminPwd", async(req, res) => {
    let {...params} = req.body
    let user = await User.findOne({_id: params._id})
    if(bcrypt.compareSync(params.oldPwd, user.password)){
        user.password = bcrypt.hashSync(params.newPwd, salt)
        user.save((err, info) => {
            if(err){
                res.status(500).json({
                    message: "修改失败，请稍后重试！"
                })
                return 
            }
            res.status(200).json({
                message: "OK"
            })
        })
    } else {
        res.status(200).json({
            message: "旧密码不正确，请输入正确的密码"
        })
    }
})

// 新建首页轮播图
router.post('/addBanner', async(req, res) => {
    let {...params} = req.body
    var imgData = params.img.replace(/^data:image\/\w+;base64,/, '')
    var dataBuffer = Buffer.from(imgData, 'base64')
    //写入文件
    let imgPath = upload + uuid.v1() + '.png'
    fs.writeFileSync(imgPath, dataBuffer)
    let banner = new Banner({
        title: params.title,
        desc: params.desc,
        img: imgPath,
        time: new Date().getTime()
    })
    await banner.save((err, info) => {
        if(err){
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
// 获取轮播图
router.get('/getAllBanner', async(req, res) => {
    await Banner.find({}).sort({time: -1}).exec((err, info) => {
        if(err){
            res.status(500).json({
                message: "获取数据失败，请稍后重试！"
            })
            return
        }
        res.status(200).json({
            message: "OK",
            banners: info
        })
    })
})
// 删除轮播图
router.post('/delBanner', async(req, res) => {
    let _id = req.body._id
    let banner = await Banner.findOne({_id})
    await Banner.deleteOne({_id}, (err, info) => {
        if(err){
            res.status(500).json({
                message: "删除失败，请稍后重试！"
            })
            return 
        }
        fs.unlinkSync(banner.img);
        res.status(200).json({
            message: "OK"
        })
    })
})
// 修改轮播图数据
router.post('/updBanner', async(req, res) => {
    let {...params} = req.body
    let banner = await Banner.findOne({_id: params._id})
    if(params.img.startsWith('data:image')){
        var imgData = params.img.replace(/^data:image\/\w+;base64,/, '')
        var dataBuffer = Buffer.from(imgData, 'base64')
        //写入文件
        let imgPath = upload + uuid.v1() + '.png'
        fs.writeFileSync(imgPath, dataBuffer)
        // 删除文件
        fs.unlinkSync(banner.img)
        params.img = imgPath
    }
    for(let key in params){
        banner[key] = params[key]
    }
    banner.save((err, info) => {
        if(err){
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



// 发布公告
router.post("/addNotice", async(req, res) => {
    let {...params} = req.body
    let notice = new Notice({
        title: params.title,
        time: new Date().getTime(),
        desc: params.desc
    })
    await notice.save((err, info) => {
        if(err){
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
// 根据id获取公告内容, 无则获取全部公告
router.get("/getNoticeByID", async(req, res) => {
    let _id = req.query._id
    if(_id){
        await Notice.find({_id}).sort({time: -1}).exec((err, info) => {
            if(err){
                res.status(500).json({
                    message: "服务器错误，请稍后重试！"
                })
                return 
            }
            res.status(200).json({
                message: "OK",
                notice: info
            })
        })
    } else {
        await Notice.find({}).sort({time: -1}).exec((err, info) => {
            if(err){
                res.status(500).json({
                    message: "服务器错误，请稍后重试！"
                })
                return 
            }
            res.status(200).json({
                message: "OK",
                notice: info
            })
        })
    }
})
// 根据id删除公告
router.post("/delNoticeByID", async(req, res) => {
    let _id = req.body._id
    await Notice.deleteOne({_id}, (err, info) => {
        if(err){
            res.status(500).json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        res.status(200).json({
            message: "OK",
        })
    })
})



// 认证管理：获取用户信息
router.get("/getAuthUser", async(req, res) => {
    await User.find({
        type: "医生",
        auth: 0,
        authStatus: 1
    }, (err, info) => {
        if(err) {
            res.status(500).json({
                message: "获取数据失败，请稍后重试！"
            })
            return 
        }
        res.status(200).json({
            message: "OK",
            users: info
        })
    })
})
// 认证管理：通过认证
router.post("/agreeAuth", async(req, res) => {
    let _id = req.body._id
    let user = await User.findOne({_id})
    user.auth = 1
    user.authStatus = 0
    await user.save((err, info) => {
        if(err){
            res.status(500).json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        let sys = new Sys({
            time: new Date().getTime(),
            desc: "您已通过认证！",
            uid: _id
        })
        sys.save((err1, info1) => {
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
// 认证管理：拒绝认证
router.post("/rejectAuth", async(req, res) => {
    let {...params} = req.body
    let sys = new Sys({
        time: new Date().getTime(),
        desc: params.desc ? params.desc : "请完善您的信息!",
        uid: params._id
    })
    let user = await User.findOne({_id: params._id})
    if(user){
        user.authStatus = 0
        user.save((err, info) => {
            if(err){
                res.status(500).json({
                    message: "服务器错误，请稍后重试！"
                })
                return 
            }
            sys.save((err1, info1) => {
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
    } else {
        res.status(500).json({
            message: "服务器错误，请稍后重试！"
        })
    }
})


// 查看用户：获取用户
router.get("/getIndexUser", async(req, res) => {
    let users = await User.find({type: "普通用户"}).skip(0).limit(10)
    let doctors = await User.find({type: "医生"}).skip(0).limit(10)
    res.status(200).json({
        message: "OK",
        users: users,
        doctors: doctors
    })
})
// 查看用户： 根据用户类型返回数据
router.get("/getUserByType", async(req, res) => {
    let type = req.query.type
    await User.find({type}).skip(0).limit(10).exec((err, info)=>{
        if(err){
            res.status(500).json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        res.status(200).json({
            message: "OK",
            users: info
        })
    })
})


// 文章管理
router.post("/getUserText", async(req, res) => {
    let {...params} = req.body
    let total = 0
    await Text.find({
        type: params.type,
        title: {$regex: params.title}
    }, (err, info) => {
        if(err){
            res.status(500).json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        total = info.length
    })
    await Text.find({
        type: params.type,
        title: {$regex: params.title}
    }).skip((params.page-1)*10).limit(10).sort({time: -1}).exec((err, info) => {
        if(err){
            res.status(500).json({
                message: "服务器错误，请稍后重试！"
            })
            return 
        }
        res.status(200).json({
            message: "OK",
            texts: info,
            total: total
        })
    })
})
// 删除文章
router.post("/delUserText", async(req, res) => {
    let { ...params } = req.body
    await Text.deleteOne({_id: params.tid})
    .then(res1 => {
        Comment.deleteMany({tid: params.tid})
        .then(res2 => {
            let sys = new Sys({
                time: new Date().getTime(),
                desc: params.desc ? params.title + params.desc : params.title + "文章内容涉及违规内容，请修改后再发布",
                uid: params.uid
            })
            sys.save().then(res3 => {
                res.status(200).json({
                    message: "OK"
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

module.exports = router