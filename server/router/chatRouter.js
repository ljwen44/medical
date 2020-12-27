const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const uuid = require('uuid')
const fs = require('fs')
const Chat = require('../model/chatModel')
const User = require('../model/userModel')
const upload = 'public/images/'

// 离线获得聊天记录
router.post("/getChat", async(req, res) => {
	let {...params} = req.body
	await Chat.aggregate([
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
				$or: [
					{
						uid: mongoose.Types.ObjectId(params.uid),
						ruid: mongoose.Types.ObjectId(params.ruid)
					},
					{
						uid: mongoose.Types.ObjectId(params.ruid),
						ruid: mongoose.Types.ObjectId(params.uid)
					}
				]
			}
		},
        {
            $project: {
                "user.password": 0,
            }
        }
	], (err, info) => {
		if(err){
			res.status(500).json({
				message: "获取数据异常，请稍后重试！"
			})
			return 
		}
		for (let i = 0; i < info.length; i++) {
			info[i].user = info[i].user[0]
		}
		res.status(200).json({
			message: "OK",
			chat: info
		})
	})
})

// 获取未读信息
router.post("/getReadChatByID", async(req, res) => {
	let {...params} = req.body
	await Chat.aggregate([
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
				ruid: mongoose.Types.ObjectId(params.uid),
				isRead: 0
			}
		},
		{
			$sort: {
				time: -1
			}
		},
		{
			$group: {
				_id: "$uid",
				readNum: {$sum: 1},
				desc: {$push:"$desc"},
				time: {$push: "$time"},
				user: {$push: "$user"}
			}
		},
		{
			$project: {
				"user.password": 0,
				"ruser.password": 0
			}
		}
	], (err, info) => {
		if(err){
			res.status(500).json({
				message: "获取数据异常，请稍后重试！"
			})
			return 
		}
		res.status(200).json({
			message: "OK",
			data: info
		})
	})
})

// 修改记录的未读状态
router.post("/updChatRead", async(req, res) => {
	let {...params} = req.body
	await Chat.updateMany({
		uid: mongoose.Types.ObjectId(params.ruid),
		ruid: mongoose.Types.ObjectId(params.uid)
	}, {
		$set: { isRead: 1}
	}, (err, info) => {
		if(err){
			res.status(500).json({
				message: "服务器错误，请稍后重试!"
			})
			return 
		}
		res.status(200).json({
			message: "OK",
			info: info
		})
	})
})

module.exports = router
