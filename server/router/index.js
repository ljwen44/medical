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
    if(userIsExist && (userIsExist.email !== "" || userIsExist.phone !== "")){
        if(userIsExist.email !== "") {
            res.status(200).json({
                message: "邮箱已存在！"
            })
        } else {
            res.status(200).json({
                message: "该手机号码已被注册！"
            })
        }
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
                message: "短信发送失败！请检查手机号码是否正确!"
            })
        }
    })
})

router.post("/validateCode", async(req, res) => {
    let validateCode = req.body.code
    endTime = new Date().getTime()
    let timeCha = endTime - startTime
    if(timeCha > 1000*60) {
        res.status(200).json({
            message: "验证码超时！"
        })
    } else {
        if(validateCode === code){
            res.status(200).json({
                message: "OK"
            })
        } else {
            res.status(200).json({
                message: "验证码错误"
            })
        }
    }
})

router.post("/updPwdByPhone", async(req, res) => {
    let {...params} = req.body
    let user = await User.findOne({phone: params.phone})
    user.password = bcrypt.hashSync(params.newPwd, salt)
    await user.save((err, info) => {
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
})

module.exports = router

