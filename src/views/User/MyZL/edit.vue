<template>
    <el-main>
        <h3>基本资料</h3>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="头像">
                <label for="file">
                    <el-avatar style="float:left;cursor: pointer;" :size="60" :src="ruleForm.avatar"></el-avatar>
                    <input id="file" ref="file" type="file" accept="image/*" style="display: none;" @change="readAvatar" />
                </label>
            </el-form-item>
            <el-form-item label="昵称" prop="userName">
                <el-input v-model="ruleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="ruleForm.sex">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="出生年月" prop="bir">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.bir" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <h3>联系方式</h3>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email" :disabled="true"></el-input>
            </el-form-item>
            <h3 v-if="ruleForm.type === '医生'">工作单位</h3>
            <el-form-item label="工作单位" prop="work" v-if="ruleForm.type === '医生'">
                <el-input v-model="ruleForm.work"></el-input>
            </el-form-item>
            <el-form-item label="所属科目" prop="job" v-if="ruleForm.type === '医生'">
                <el-input v-model="ruleForm.job"></el-input>
            </el-form-item>
            <h3 v-if="ruleForm.type === '医生'">上传证件</h3>
            <el-form-item label="上传证件" prop="IDpass" v-if="ruleForm.type === '医生'">
                <input type="file" ref="IDpass" @change="handleIDpass">
                <img :src="ruleForm.IDpass" alt="" preview="1" width="150">
            </el-form-item>
            <h3>简介</h3>
            <el-form-item label="个人简介">
                <el-input type="textarea" resize="none" v-model="ruleForm.introduce" rows="6" cols="30"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">修改资料</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
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
            ruleForm: {
                sex: "男",
            },
            rules: {
                phone: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: validatePhone, trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '请输入昵称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                bir: [
                    { required: true, message: '请选择日期', trigger: 'change' }
                ],
                work: [
                    { required: true, message: '请输入工作单位', trigger: 'blur' }
                ],
                job: [
                    { required: true, message: '请输入科目', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        let obj = JSON.stringify(this.user)
        this.ruleForm = { ...this.ruleForm, ...JSON.parse(obj)}
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.axios.post('/updateInfo', this.ruleForm)
                    .then(res => {
                        if(res.data.message === "OK"){
                            this.$alert('修改成功！', '提示', {
                                confirmButtonText: "确定",
                                callback: () => {
                                    this.$store.commit('SETUSER', res.data.user)
                                    this.$router.push('/user/myzl')
                                }
                            })
                        } else {
                            console.log(res.data.message)
                        }
                    }).catch(err => {
                        this.$alert('服务器超时，请稍后重试！','提示',{
                            confirmButtonText: '确定'
                        })
                    })
                } else {
                    return false;
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        readAvatar(){
            let files = this.$refs.file.files
            if(files[0].size > 500*1024){
                alert("图片大小不得超过500kb")
                return 
            }
            var fileReader = new FileReader()
            fileReader.readAsDataURL(files[0])
            let that = this
            fileReader.onload = function (event) {
                that.ruleForm.avatar = event.target.result
            }
        },
        handleIDpass(){
            let files = this.$refs.IDpass.files
            if(files[0].size > 500*1024){
                alert("图片大小不得超过500kb")
                return 
            }
            var fileReader = new FileReader()
            fileReader.readAsDataURL(files[0])
            let that = this
            fileReader.onload = function (event) {
                that.ruleForm.IDpass = event.target.result
            }
        }
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
}
</script>

<style lang='less' scoped>
.el-main{
    h3{
        text-align: left;
        border-left: 5px solid #3cabcf;
        margin: 1rem;
        padding-left: 10px;
    }
    .el-form{
        width: 70%;
        .el-form-item{
            text-align: left;
        }
        .el-form-item:last-child{
            text-align: left;
        }
    }
}
</style>