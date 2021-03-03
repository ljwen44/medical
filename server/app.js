const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("./model/index")
const app = express()
const server  = require('http').createServer(app);
const session = require("express-session")
// 路由引入
const router = require("./router/index")
const adminRouter = require("./router/adminRouter")
const textRouter = require("./router/textRouter")
const userRouter = require("./router/userRouter")
const sysRouter = require("./router/sysRouter")
const commentRouter = require("./router/commentRouter")
const noticeRouter = require("./router/noticeRouter")
const chatRouter = require("./router/chatRouter")
const analysisRouter = require("./router/analysis")
var io = require('./router/chat.js')

app.use('/public',express.static('public'));//将文件设置成静态
// 使用中间件解析表单数据
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json())
app.use(session({
    "secret": "xxx",
    "resave": false,
    "saveUninitialized": true
}))

app.use(router)
app.use(adminRouter)
app.use(textRouter)
app.use(userRouter)
app.use(sysRouter)
app.use(commentRouter)
app.use(noticeRouter)
app.use(chatRouter)
app.use(analysisRouter)

io(server)

server.listen(3000, ()=>{
    console.log("server start at 3000")
});