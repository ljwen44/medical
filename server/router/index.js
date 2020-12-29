const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const fs = require('fs');
const uuid = require('uuid')
const User = require('../model/userModel')
const Focus = require('../model/focusModel')
const ExitData = require('../model/exitModel')
const {randomCode, sendCode} = require("../config/phone")
// 加密
const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10)
// token
const jwt = require('jsonwebtoken')

const upload = 'public/images/'
let code = '' // 手机验证码
let startTime = '' // 发送验证码开始时间
let endTime = '' // 登录时验证码的有效时间
router.post("/login", async(req, res) => {
    let {...params} = req.body
    if(!params.loginType){
        let user = await User.findOne({
            email: params.email
        })
        if(user && bcrypt.compareSync(params.password, user.password)){
            user = user.toObject()
            delete user.password
            if(user.type !== "管理员"){
                let focus
                await Focus.find({
                    uid: user._id
                }, {cuid:1, _id: 0}, (err, info) => {
                    if(err){
                        res.status(500).json({
                            message: "服务器超时，请刷新重试！"
                        })
                        return 
                    }
                    focus = info
                })
                await ExitData.findOne({
                    uid: user._id
                }, (err, info) => {
                    if(err){
                        res.status(500).json({
                            message: "服务器超时，请刷新重试！"
                        })
                        return 
                    }
                    res.status(200).json({
                        message: "OK",
                        lastest: info,
                        focus: focus,
                        user: user
                    })
                })
            } else {
                res.status(200).json({
                    message: "OK",
                    user: user
                })
            }
        } else {
            res.status(200).json({
                message: "邮箱或密码不正确",
                code: 400
            })
        }
    }
})

router.post("/register", async(req, res) => {
    let {...params} = req.body
    let userIsExist = await User.findOne({email: params.email})
    if(userIsExist){
        res.status(200).json({
            message: "用户已存在！"
        })
    } else {
        if(params.img){
            var imgData = params.img.replace(/^data:image\/\w+;base64,/, '');
            var dataBuffer = Buffer.from(imgData, 'base64');
            //写入文件
            let imgPath = upload + uuid.v1() + '.png'
            fs.writeFile(imgPath, dataBuffer, function(err){
                if(err){
                    res.status(400).json({
                        message: "服务器超时，请刷新重试！"
                    })
                    return 
                }else{
                    let user = new User({
                        email: params.email,
                        userName: "游客" + Math.floor(Math.random()*100000),
                        password: bcrypt.hashSync(params.password, salt),
                        type: params.type,
                        phone: params.phone,
                        IDpass: imgPath,
                        auth: 0
                    })
                    user.save((err, info) => {
                        if(err){
                            res.status(400).json({
                                message: "添加失败，请刷新重试！"
                            })
                            return 
                        }
                        user.password = ''
                        res.status(200).json({
                            user: user,
                            message: "OK"
                        })
                    })
                }
            })
        } else {
            let user = new User({
                email: params.email,
                userName: "游客" + Math.floor(Math.random()*100000),
                password: bcrypt.hashSync(params.password, salt),
                type: params.type,
                phone: params.phone,
            })
            user.save((err, info) => {
                if(err){
                    res.status(400).json({
                        message: "添加失败，请刷新重试！"
                    })
                    return 
                }
                user.password = ''
                res.status(200).json({
                    user: user,
                    message: "OK"
                })
            })
        }
    }
})

router.post("/sendCode", async(req, res) => {
    let phone = req.body.phone
    code = randomCode(6)
    sendCode(phone, code, (result) => {
        if(result){
            startTime = new Date().getTime()
            res.status(200).json({
                message: "OK"
            })
        } else {
            res.status(200).json({
                message: "短信发送失败！"
            })
        }
    })
})
// app.get("/testphone", (req, res) => {
//     let code = randomCode(6)
//     sendCode('13662382308', code, (result) => {
//         console.log(result)
//         if(result){
//             res.status(200).json({
//                 message: "短信发送成功！"
//             })
//         } else {
//             res.status(200).json({
//                 message: "短信发送失败！"
//             })
//         }
//     })
// })
module.exports = router

