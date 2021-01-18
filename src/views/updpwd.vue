<template>
    <div class="wrapper">
        <el-container class="elContainer_login">
            <h3 @click="gotoLogin">医疗咨询平台</h3>
            <el-main>
                <el-steps :active="active" finish-status="success">
                    <el-step title="手机验证"></el-step>
                    <el-step title="修改密码"></el-step>
                    <el-step title="完成操作"></el-step>
                </el-steps>
                <el-form :model="form" status-icon :rules="rules" ref="form" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="手机号码" v-show="active === 1" prop="userPhone">
                        <el-input v-model="form.userPhone" autocomplete="off" show-word-limit maxlength="11" placeholder="请输入手机号码">
                            <template slot="append">
                                <el-button type="warning" @click="handleClick" :disabled="time !== 60">
                                    {{time === 60? "发送" : time + "s"}}
                                </el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="验证码" v-show="active === 1">
                        <el-input v-model="form.validCode"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="pass" v-show="active === 2">
                        <el-input type="password" v-model="form.pass" autocomplete="off" placeholder="请输入6~12位的密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass" v-show="active === 2">
                        <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <div class="finishTip" v-show="active === 3">
                        <i class="el-icon-warning">修改成功！</i>
                        <el-button type="success" @click="gotoLogin">点击返回登录</el-button>
                    </div>
                </el-form>
                <el-button style="margin-top: 12px; float:right;" @click="next" v-if="active !== 3">下一步</el-button>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    data() {
        let reg = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/
        let validatePhone = (rule, value, callback) => {
            if(value === '' || value === undefined){
                callback(new Error('请输入手机号码'))
            } else if(!reg.test(value)){
                callback(new Error('请输入正确的手机号码'))
            } else {
                callback()
            }
        }
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else if (this.form.checkPass !== '') {
                this.$refs.form.validateField('checkPass')
            } else {
                callback()
            }
        }
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.form.pass) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            active: 1,
            form: {
                pass: '',
                checkPass: '',
                userPhone: '',
                validCode: ''
            },
            reg: /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/, // 手机验证
            rules: {
                userPhone: [
                    { validator: validatePhone, trigger: 'blur' }
                ],
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            },
            time: 60,
            flag: false // 手机发送状态
        }
    },
    methods: {
        next() {
            if(this.active === 1){
                if(!this.flag){
                    this.$message("请进行手机验证!")
                    return 
                }  
                if(!this.form.validCode){
                    this.$message("请输入验证码!")
                    return 
                }
                // 执行手机验证操作
                this.axios.post("/validateCode", {
                    code: this.form.validCode
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.active = 2
                    } else {
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定",
                            callback: () => {
                                this.flag = false
                            }
                        })
                    }
                }).catch(err => {
                    this.$alert("操作失败，请稍后重试！", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            } else {
                // 执行修改密码操作
                if(!this.form.pass || !this.form.checkPass){
                    this.$message("请填写信息!")
                    return 
                }
                if(this.form.pass.trim() !== this.form.checkPass.trim()){
                    this.$message("两次密码输入不一致")
                    return 
                }
                this.axios.post("/updPwdByPhone", {
                    phone: this.form.userPhone,
                    newPwd: this.form.pass
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.$message({
                            message: "修改成功",
                            type: "success"
                        })
                        this.active = 3
                    } else {
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    }
                }).catch(err => {
                    this.$alert("修改失败，请稍后重试!", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }
        },
        handleClick(){
            if(!this.form.userPhone){
                this.$message("请填写手机号码")
                return
            } 
            if(!this.reg.test(this.form.userPhone)){
                this.$message("请填写正确的手机号码")
                return 
            }
            this.axios.post('/sendCode', {
                phone: this.form.userPhone
            }).then(res => {
                if(res.data.message === "OK"){
                    this.$message({
                        message: "发送成功！",
                        type: "success"
                    })
                    this.flag = true
                    let timer = setInterval(() => {
                        if(this.time > 1){
                            this.time--
                        } else {
                            this.time = 60
                            clearInterval(timer)
                        }
                    }, 1000)
                } else {
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("获取验证码失败，请刷新重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        gotoLogin(){
            this.$router.push('/medical/login')
        }
    }
}
</script>

<style lang='less' scoped>
.wrapper{
    width: 100%;
    height: 100vh;
}
.wrapper::after{
    opacity: 0.6;
    background: url('../assets/images/bg.jpg');
    background-size: cover;
    content: "";
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: -1;
    filter: blur(5px);
}
.elContainer_login{
    overflow: hidden;
    border-radius: 8px;
    position: absolute;
    top: 20%;
    width: 30%;
    background: rgba(255, 255, 255, .8);
    box-shadow: 0 0 20px #ccc;
    display: block;
    h3{
        text-align: center;
        font-size: 24px;
        padding: 10px;
    }
    .el-main{
        .el-form{
            margin-top: 60px;
            .el-form-item{
                margin-bottom: 5%;
                .errMsg{
                    color: red;
                }
                .el-link{
                    float: right;
                    font-size: 12px;
                }
                .upload-demo{
                    margin-left: -50px;
                }
                .fileBtn{
                    border: 1px solid #606266;
                    padding: 2%;
                    border-radius: 5px;
                    cursor: pointer;
                    color: #606266;
                }
            }
            .finishTip{
                text-align: center;
                .el-icon-warning{
                    font-size: 20px;
                    color: green;
                    display: block;
                    margin-bottom: 20px;
                }
                .el-icon-warning:before {
                    margin-right: 15px;
                    font-size: 36px;
                }
            }
            .btnBox{
                margin: 0;
                .el-button{
                    width: 50%;
                }
            }
        }
    }
}
@media screen and (max-width: 768px) {
    .elContainer_login{
        width: 80%;
        left: 10%;
        .el-form{
            padding: 0;
        }
    }
}
@media screen and (min-width: 769px) and (max-width: 1200px){
    .elContainer_login{
        width: 60%;
        left: 20%;
        .el-form{
            padding: 0 10%;
        }
    }
}
@media screen and (min-width: 1201px){
    .elContainer_login{
        width: 70%;
        left: 15%;
        .el-form{
            padding: 0 20%;
        }
    }
}
</style>