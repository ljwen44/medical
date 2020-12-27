module.exports = (server) => {
    var io = require('socket.io')(server)
    var Chat = require('../model/chatModel.js')
    // 用于存储每个用户的socket，实现私聊的功能
    let arrAllSocket = {}
    // 穿件socket连接
    io.on('connection', (socket) => {
        // join函数 用于用户连接
        socket.on('join', (obj) => {
            console.log(obj.uid + ':join')
            // 保存每个用户的连接状态 用于私发消息
            arrAllSocket[obj.uid] = socket
        })
        // 接收前台发送的消息 函数名为message
        socket.on('message', (data) => {
            // 将消息发送回前台（调用前台定义的方法） 函数名为sendMessage
            io.emit('sendMessage', data)
        })
        // 私发消息
        socket.on('sendmsg', (data) => {
            // 新建聊天记录保存到数据库
            let time = new Date().getTime()
            let chat = new Chat({
                uid: data.user._id,
                ruid: data.ruser._id,
                desc: data.desc,
                time: time
            })
            chat.save().then(result1 => {
                // 查询用户连接
                let target = arrAllSocket[data.ruser._id]
                data.time = time
                if(target) {
                    //发送信息至指定的人
                    target.emit('receivemsg', data)
                }
                socket.emit('sendMessage', data)
            }).catch(err => {
                console.log(err)
                socket.emit('recError', {
                    message: "error"
                })
            })
        })
    })
}