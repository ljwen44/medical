<template>
    <el-main>
        <h3>发布公告</h3>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" class="demo-ruleForm">
            <el-form-item label="标题" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
                <el-input 
                    type="textarea" 
                    v-model="ruleForm.desc" 
                    class="descBox" 
                    resize="none"
                    rows="10"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
            </el-form-item>
        </el-form>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            ruleForm: {
                title: '',
                desc: ''
            },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                ],
                desc: [
                    { required: true, message: '请描述内容', trigger: 'blur' }
                ]
            },
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.axios.post("/addNotice", this.ruleForm)
                    .then(res => {
                        if(res.data.message === "OK"){
                            this.$alert("发布成功！", "提示", {
                                confirmButtonText: "确定",
                                callback: () => {
                                    this.resetForm('ruleForm')
                                    this.$router.push("/admin/pub/allPub")
                                }
                            })
                        } else {
                            this.$alert(res.data.message, "提示", {
                                confirmButtonText: "确定"
                            })
                        }
                    }).catch(err => {
                        this.$alert("发布公告失败，请稍后重试！", "提示", {
                            confirmButtonText: "确定"
                        })
                    })
                } else {
                    return false;
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        }
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    h3{
        text-align: left;
        border-left: 5px solid #3cabcf;
        margin: 1rem;
        padding-left: 10px;
    }
}
</style>