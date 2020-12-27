const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const uuid = require('uuid')
const fs = require('fs')
const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10)

const User = require('../model/userModel')
const Focus = require('../model/focusModel')
const ExitData = require('../model/exitModel')

const upload = 'public/images/'

// 更新信息
router.post('/updateInfo', async(req, res) => {
	let {...params} = req.body
	let user = await User.findOne({_id: params._id}, {password: 0})
	if(params.avatar.startsWith('data:image')){
		var imgData = params.avatar.replace(/^data:image\/\w+;base64,/, '')
	    var dataBuffer = Buffer.from(imgData, 'base64')
	    //写入文件
	    let imgPath = upload + uuid.v1() + '.png'
	    fs.writeFileSync(imgPath, dataBuffer)
	    params.avatar = imgPath
	}
	if(params.IDpass.startsWith('data:image')){
		var imgData1 = params.IDpass.replace(/^data:image\/\w+;base64,/, '')
	    var dataBuffer1 = Buffer.from(imgData1, 'base64')
	    //写入文件
	    let imgPath1 = upload + uuid.v1() + '.png'
	    fs.writeFileSync(imgPath1, dataBuffer1)
	    fs.unlinkSync(user.IDpass)
	    params.IDpass = imgPath1
	}
	for(let key in params){
    	user[key] = params[key]
    }
	await user.save((err, info) => {
		if(err){
			res.status(400).json({
				message: "修改失败，请刷新重试！"
			})
			return 
		}
		res.status(200).json({
			user: user,
			message: "OK"
		})
	})
})

// 修改密码
router.post('/updatePwd', async(req, res) => {
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

// 根据id查找用户
router.post('/getUserByID', async(req, res)=>{
	let {...params} = req.body
	let user = await User.findOne({_id: params._id}, {password: 0})
	if(user){
		res.status(200).json({
			message: "OK",
			user: user
		})
	} else {
		res.status(500).json({
			message: "服务器错误，请稍后重试！"
		})
	}
})

// 更改认证状态
router.post('/updAuthStatus', async(req, res) => {
	let {...params} = req.body
	await User.findOneAndUpdate(
		{_id: params._id}, 
		{authStatus:params.authStatus}, 
		{
			new: true,
			select: {password: 0}
		}, 
		(err,info)=>{
			if(err) {
				console.log(err)
				res.status(500).json({
					message:"服务器错误，请稍后重试！"
				})
				return 
			}
			res.status(200).json({
				message: "OK",
				user: info
			})
		}
	)
})

// 模糊查询：根据类型和userName进行查询
router.post("/getUsersByIDandType", async(req, res) => {
	let {...params} = req.body
	await User.find({
		userName: {$regex: params.userName},
		type: params.type
	}, {
		password: 0
	}, (err, info) => {
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

// 推荐查询: 首页推荐用户
router.get("/getUserByRecommened", async(req, res) => {
	await User.find({
		type: "医生",
		auth: 1
	}, {password: 0}).sort({fans: -1}).limit(5).exec((err, info) => {
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

// 关注功能
router.post("/focusUser", async(req, res) => {
	let {...params} = req.body
	let focus = new Focus({
		uid: params.uid,
		cuid: params.cuid,
		time: new Date().getTime()
	})
	await focus.save((err, info) => {
		if(err){
			res.status(500).json({
				message: "服务器错误，请稍后重试！"
			})
			return 
		}
		User.updateOne({_id: params.cuid}, {$inc: {fans: 1}}, (err, info) => {
			if(err){
				console.log(err)
			}
		})
		User.updateOne({_id: params.uid}, {$inc: {focus: 1}}, (err, info) => {
			if(err){
				console.log(err)
			}
		})
		res.status(200).json({
			message: "OK"
		})
	})
})

// 取消关注
router.post("/cancelFocusUser", async(req, res) => {
	let {...params} = req.body
	await Focus.deleteOne({
		uid: params.uid,
		cuid: params.cuid
	}, (err, info) => {
		if(err){
			res.status(500).json({
				message: "服务器错误，请稍后重试！"
			})
			return 
		}
		User.updateOne({_id: params.cuid}, {$inc: {fans: -1}}, (err, info) => {
			if(err){
				console.log(err)
			}
		})
		User.updateOne({_id: params.uid}, {$inc: {focus: -1}}, (err, info) => {
			if(err){
				console.log(err)
			}
		})
		res.status(200).json({
			message: "OK"
		})
	})
})

// 获取关注列表
router.post("/getFocusList", async(req, res) => {
	let {...params} = req.body
	let focus = []
	await Focus.aggregate([
		{
			$lookup: {
				from: "users",
				localField: "cuid",
				foreignField: "_id",
				as: "user"
			}
		},
		{
			$match: {
				uid: mongoose.Types.ObjectId(params._id)
			}
		},
		{
			$sort: {
				time: -1
			}
		},
		{
			$skip: (params.page-1)*10
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
		focus = info
	})
	await Focus.find({uid: params._id}).countDocuments((err, info) => {
		if(err){
			res.status(500).json({
				message: "服务器错误，请稍后重试！"
			})
			return 
		}
		res.status(200).json({
			message: "OK",
			focus: focus,
			total: info
		})
	})
})

// 获取粉丝列表
router.post("/getFansList", async(req, res) => {
	let {...params} = req.body
	let fans = []
	await Focus.aggregate([
		{
			$lookup: {
				from: "users",
				localField: "uid",
				foreignField: "_id",
				as: "user"
			}
		},
		{
			$match: {
				cuid: mongoose.Types.ObjectId(params._id)
			}
		},
		{
			$sort: {
				time: -1
			}
		},
		{
			$skip: (params.page-1)*10
			
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
		fans = info
	})
	await Focus.find({cuid: params._id}).countDocuments((err, info) => {
		if(err){
			res.status(500).json({
				message: "服务器错误，请稍后重试！"
			})
			return 
		}
		res.status(200).json({
			message: "OK",
			fans: fans,
			total: info
		})
	})
})

// 退出登录时保存数据
router.post("/saveExitData", async(req, res) => {
	let {...params} = req.body
	let exitDataIsExist = await ExitData.findOne({uid: params.uid})
	if(!exitDataIsExist){
		let exitData = new ExitData({
			uid: params.uid,
			visit: params.visit,
			watch: params.watch,
			like: params.like,
			chat: params.chat
		})
		exitData.save((err, info) => {
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
	} else {
		ExitData.updateOne({
			uid: params.uid
		}, {
			visit: params.visit,
			watch: params.watch,
			like: params.like,
			chat: params.chat
		}, (err, info) => {
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
	}
})

module.exports = router