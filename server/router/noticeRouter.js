const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Notice = require('../model/noticeModel')

// 获取公告列表
router.post('/getNotice', async(req, res) => {
	let {...params} = req.body
	let notices
	await Notice.find({})
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
				notices = info
			})
	await Notice.find({}, (err, info) => {
		if(err){
			res.status(500).json({
				message: "服务器错误，请稍后重试！"
			})
			return 
		}
		res.status(200).json({
			message: "OK",
			total: info.length,
			notices
		})
	})
})

// 根据id获取公告
router.post("/getNoticeByID", async(req, res) => {
	let _id = req.body._id
	await Notice.findOne({_id}, (err, info) => {
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
})

module.exports = router
