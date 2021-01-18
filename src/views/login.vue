<template>
    <div class="wrapper">
        <el-container class="elContainer_login">
            <h3>医疗咨询平台</h3>
            <el-main>
                <el-form ref="form" :model="form" label-width="80px" v-show="loginBox" :rules="rules" status-icon>
                    <div v-show="!phoneStatus">
                        <el-form-item label="邮箱" prop="userEmail">
                            <el-input v-model="form.userEmail" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="userPwd">
                            <el-input v-model="form.userPwd" show-password></el-input>
                        </el-form-item>
                    </div>
                    <div v-show="phoneStatus">
                        <el-form-item label="手机号码" prop="userPhone">
                            <el-input v-model="form.userPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="validCode">
                            <el-input v-model="form.validCode">
                                <template slot="append">
                                    <el-button type="warning" @click="sendCode" :disabled="time === 60">{{time === 60? '发送' : time + 's'}}</el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <el-form-item class="btnBox">
                        <el-button type="primary" @click="submitLogin">登录</el-button>
                        <el-link type="primary" :underline="false" @click="handleTransform" data-index="0">还没有账号？点击注册</el-link>
                        <div>
                            <el-link type="primary" :underline="false" @click="phoneStatus = !phoneStatus">{{phoneStatus?"账号登录":"手机登录"}}</el-link>
                            <el-link type="primary" :underline="false" @click="handleUpdPwd">忘记密码？</el-link>
                        </div>
                    </el-form-item>
                </el-form>
                <el-form ref="form" :model="form" label-width="80px" v-show="!loginBox" :rules="rules">
                    <el-form-item label="邮箱" prop="userEmail">
                        <el-input v-model="form.userEmail" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="userPwd">
                        <el-input v-model="form.userPwd" show-password placeholder="请输入6~12位的密码"></el-input>
                    </el-form-item>
                    <el-form-item label="类别">
                        <el-radio-group v-model="form.type">
                            <el-radio label="普通用户"></el-radio>
                            <el-radio label="医生"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="upload" label="上传证件">
                        <span class="fileBtn" @click="handleFile">
                            <input type="file" accept="image/*" style="display:none" ref="file" @change="handleImg" />上传图片
                        </span>
                        <span style="margin-left: 2%;font-size:12px;">{{imgName}}</span>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="userPhone">
                        <el-input v-model="form.userPhone" show-word-limit maxlength="11" placeholder="请输入手机号码">
                            <template slot="append">
                                <el-button type="warning" @click="sendCode" :disabled="time !== 60">{{time === 60? '发送' : time + 's'}}</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="validCode">
                        <el-input v-model="form.validCode"></el-input>
                    </el-form-item>
                    <el-form-item class="btnBox">
                        <el-button type="primary" @click="submitReg">注册</el-button>
                        <el-link type="primary" :underline="false" @click="handleTransform" :data-index="1">已有账号？点击登录</el-link>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    data() {
        let regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ // 邮箱验证
        let reg = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/ // 手机验证
        let validatePhone = (rule, value, callback) => {
            if(!reg.test(value)){
                callback(new Error('请输入正确的手机号码'))
            } else {
                callback()
            }
        }
        let validateEmail = (rule, value, callback) => {
            if(!regEmail.test(value)){
                callback(new Error('请输入正确的邮箱'))
            } else {
                callback()
            }
        }
        return {
            form: {
                userEmail: '', // 邮箱
                userPwd: '', // 密码
                type: '普通用户', // 用户类型
                validCode: '', // 验证码
                img: "", // 类型为医生的用户上传的证件
                userPhone: '', // 手机号码
            }, // 表单信息
            loginBox: true, // 登录注册框
            phoneStatus: false, // 手机号码登录状态切换
            upload: false, // 注册用户为医生时显示上传组件
            imgName: "只能上传jpg/png文件，且不超过500kb", // 上传图片的名称
            rules: {
                userPhone: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: validatePhone, trigger: 'blur' }
                ],
                userEmail: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' }
                ],
                userPwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min:6, max: 12, message: "密码应是6-12位数字、字母或字符！", trigger: 'blur' }
                ],
                validCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            },
            time: 60,
            flag: false
        }
    },
    methods: {
        submitLogin() {
            let data = {
                email: this.form.userEmail,
                password: this.form.userPwd,
                phone: this.form.userPhone,
                loginType: this.phoneStatus,
                validCode: this.form.validCode
            }
            this.axios.post('/login', data)
            .then(res => {
                if(res.data.message === "OK"){
                    if(res.data.user.type === "管理员"){
                        this.$alert('登录成功！', '提示', {
                            confirmButtonText: '确定',
                            callback: ()=>{
                                this.$store.commit('SETUSER', res.data.user)
                                this.$router.push({
                                    path: '/admin',
                                    query: {
                                        uid: res.data.user._id
                                    }
                                })
                            }
                        })
                    } else {
                        this.$alert('登录成功！', '提示', {
                            confirmButtonText: '确定',
                            callback: ()=>{
                                this.$store.commit('SETUSER', res.data.user)
                                this.$store.commit('INITFOCUS', res.data.focus)
                                if(res.data.lastest){
                                    this.$store.commit('SETVISIT', JSON.parse(res.data.lastest.visit))
                                    this.$store.commit('SETWATCH', JSON.parse(res.data.lastest.watch))
                                    res.data.lastest.chat 
                                    ? this.$store.commit('INITCHATLIST', JSON.parse(res.data.lastest.chat))
                                    : ''
                                }
                                this.$router.push('/medical')
                            }
                        })
                    }
                } else {
                    this.$alert(res.data.message, '提示', {
                        confirmButtonText: '确定'
                    })
                }
            }).catch(err => {
                this.$alert('服务器错误，请稍后重试！', '提示', {
                    confirmButtonText: '确定'
                })
            })
        },
        submitReg(){
            if(!this.form.userEmail || !this.form.userPwd || !this.form.userPhone){
                this.$message("请先填好信息")
                return 
            }
            if(this.form.type === "医生"){
                if(!this.form.img){
                    this.$alert("请上传证件照！", "提示", {
                        confirmButtonText: "确定"
                    })
                    return 
                }
            }
            if(!this.flag){
                this.$message("请先发送验证码")
                return 
            }
            if(!this.form.validCode){
                this.$message("请填写验证码")
                return 
            }
            this.axios.post("/validateCode", {
                code: this.form.validCode
            }).then(res => {
                if(res.data.message !== "OK"){
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                } else {
                    this.valiCodeAfter()
                }
            }).catch(err => {
                this.$alert("操作失败，请稍后重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
            
        },
        // 发送验证码
        sendCode(){
            if(!this.form.userPhone){
                this.$message("请填写手机号码")
                return 
            }
            this.axios.post('/sendCode', {
                phone: this.form.userPhone
            }).then(res => {
                if(res.data.message === "OK"){
                    this.flag = true
                    let timer = setInterval(() => {
                        this.time--
                        if(this.time === 0){
                            clearInterval(timer)
                            this.time = 60
                        }
                    }, 1000)
                } else {
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("发送失败，请稍后重试!", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleFile(){
            this.$refs.file.click()
        },
        handleImg(){
            let files = this.$refs.file.files
            if(files[0].size > 500*1024){
                alert("文件大小不得超过500kb")
                return 
            }
            this.imgName = files[0].name
            var fileReader = new FileReader()
            fileReader.readAsDataURL(files[0])
            let that = this
            fileReader.onload = function (event) {
                that.form.img = event.target.result
            }
        },
        handleTransform(e){
            this.$refs['form'].resetFields();
            this.loginBox = !this.loginBox
        },
        handleUpdPwd(){
            this.$router.push('/medical/updpwd')
        },
        valiCodeAfter(){
            let data = {
                email: this.form.userEmail,
                password: this.form.userPwd,
                type: this.form.type,
                phone: this.form.userPhone,
                img: this.form.img
            }
            this.axios.post('/register', data)
            .then(res => {
                if(res.data.message === "OK"){
                    this.$alert('注册成功！', '提示', {
                        confirmButtonText: '确定',
                        callback: () => {
                            this.$store.commit('SETUSER', res.data.user)
                            this.$router.push('/medical')
                        }
                    })
                } else {
                    this.$alert(res.data.message, '提示', {
                        confirmButtonText: '确定'
                    })
                }
            }).catch(err => {
                this.$alert("服务器繁忙，请稍后重试！", '提示', {
                    confirmButtonText: '确定'
                })
            })
        }
    },
    watch: {
        "form.type": {
            handler:function(newVal,oldVal){
                if(newVal === "医生"){
                    this.upload = true
                } else {
                    this.upload = false
                }
            }
        }
    },
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
        padding: 10px;
        font-size: 24px;
    }
    .el-main{
        .el-form{
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
    }
}
@media screen and (min-width: 769px) and (max-width: 992px){
    .elContainer_login{
        width: 60%;
        left: 20%;
    }
}
@media screen and (min-width: 993px) and (max-width: 1200px){
    .elContainer_login{
        width: 40%;
        left: 35%;
    }
}
@media screen and (min-width: 1201px){
    .elContainer_login{
        width: 30%;
        left: 35%;
    }
}
</style>