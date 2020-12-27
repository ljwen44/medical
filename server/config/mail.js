const nodemailer = require("nodemailer")
module.exports =  nodemailer.createTransport({
    host: 'smtp.qq.com',
    service: 'qq',
    secure: true,
    // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
    auth: {
        user: '2236264909@qq.com',
        pass: 'rfvqudshmtotdije'
    }
})
