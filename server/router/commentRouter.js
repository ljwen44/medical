const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const uuid = require('uuid')
const Text = require('../model/textModel')
const User = require('../model/userModel')
const Comment = require('../model/commentModel')

// 发表评论
router.post("/addComment", async(req, res) => {
	let {...params} = req.body
	let comment = new Comment({
		desc: params.desc,
		uid: params.uid,
		tid: params.tid,
		time: new Date().getTime()
	})
	await comment.save((err, info) => {
		if(err){
			res.status(500).json({
				message: "服务器错误，请稍后重试！"
			})
			return 
		}
		Text.updateOne({_id: params.tid}, {$inc: {reply:1}}, (err, info) => {
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
})

// 查询评论： 根据id查询评论(文章详情页面)
router.post('/getCommentByID', async(req, res) => {
	let {...params} = req.body
	await Comment.aggregate([
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
				tid: mongoose.Types.ObjectId(params.tid)
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
		Comment.find({tid: params.tid}, (err1, info1) => {
			if(err1){
				res.status(500).json({
					message: "服务器错误，请稍后重试！"
				})
				return 
			}
			res.status(200).json({
				message: "OK",
				commentList: info,
				total: info1.length
			})
		})
		
	})
})

// 我的回复：用户个人中心模块
router.post('/getCommentByUID', async(req, res) => {
	let {...params} = req.body
	let total
	await Comment.aggregate([
		{
			$lookup: {
				from: "texts",
				localField: "tid",
				foreignField: "_id",
				as: "text"
			}
		},
		{
			$match: {
				"text.uid": mongoose.Types.ObjectId(params.uid)
			}
		}
	], (err, info) => {
		if(err) {
			res.status(500).json({
				message: "服务器错误，请稍后重试！"
			})
			return 
		}
		total = info.length
	})
	await Comment.aggregate([
		{
			$lookup: {
				from: "users",
				localField: "uid",
				foreignField: "_id",
				as: "user"
			}
		},
		{
			$lookup: {
				from: "texts",
				localField: "tid",
				foreignField: "_id",
				as: "text"
			}
		},
		{
			$match: {
				"text.uid": mongoose.Types.ObjectId(params.uid)
			}
		},
		{
			$skip: (params.page - 1)*10
		},
		{
			$limit: 10
		},
		{
			$sort: {
				time: -1
			}
		},
		{
			$project: {
				"user.password": 0,
			}
		}
	], (err, info) => {
		if(err) {
			res.status(500).json({
				message: "服务器错误，请稍后重试！"
			})
			return 
		}
		res.status(200).json({
			message: "OK",
			data: info,
			total: total
		})
	})
})


module.exports = router
