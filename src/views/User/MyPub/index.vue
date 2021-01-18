<template>
    <el-container>
        <el-main>
            <h3>发表文章</h3>
            <el-row style="text-align: left;margin-bottom: 20px;">
                <el-button type="primary" @click="flag = !flag" v-if="flag">{{user.type === "医生"? "发表文章": "发表提问"}}</el-button>
            </el-row>
            <el-timeline v-if="flag && list.length">
                <el-timeline-item
                    v-for="(item, index) in list"
                    :key="index"
                    :timestamp="parseInt(item.time) | timeFilter('yyyy-MM-dd')" placement="top">
                    <el-card>
                        <router-link tag="h4" :to="'/detail?_id=' + item._id + '&uid='+item.uid">{{item.title}}</router-link>
                        <p>
                            提交于 {{parseInt(item.time) | timeFilter('yyyy-MM-dd hh:mm:ss')}}
                            <span class="delBtn" @click="delText(item._id, index)">删除</span>
                            <span style="float: right;">回复: {{item.reply | numFilter}}</span>
                        </p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
            <p v-if="flag && !list.length" style="text-align: left;">
                您还没有发表过文章哦~
            </p>
            <el-form v-if="!flag" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" class="demo-ruleForm">
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
                    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                    <el-button type="defalut" @click="flag=!flag">返回</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            list: [],
            flag: true,
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
                    let data = {
                        title: this.ruleForm.title,
                        desc: this.ruleForm.desc,
                        _id: this.user._id,
                        type: this.user.type
                    }
                    this.axios.post('/addText', data)
                    .then(res => {
                        if(res.data.message === 'OK'){
                            this.$alert('发表成功', '提示', {
                                confirmButtonText: '确定',
                                callback: () => {
                                    this.resetForm('ruleForm')
                                    this.flag = true
                                    this.getText()
                                }
                            })
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
                } else {
                    return false;
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        getText(){
            let data = {
                uid: this.user._id
            }
            this.axios.get('/getText', {params: data})
            .then(res => {
                this.list = res.data.data
            }).catch(err => {
                this.$message("获取信息失败，请稍后重试！")
            })
        },
        delText(id, index){
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post("/delText", {tid: id})
                .then(res => {
                    if(res.data.message === "OK"){
                        this.list.splice(index, 1)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.$store.commit("DELWATCH", id)
                    } else {
                        this.$alert(res.data.message,"提示", {
                            confirmButtonText: "确定"
                        })
                    }
                }).catch(err => {
                    this.$alert("删除失败，请稍后重试！","提示", {
                        confirmButtonText: "确定"
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })  
            })
        }
    },
    created() {
        this.getText()
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
}
</script>

<style lang='less' scoped>
.el-container{
    .el-main{
        min-height: 400px;
        h3{
            text-align: left;
            border-left: 5px solid #3cabcf;
            margin: 1rem;
            padding-left: 10px;
        }
        .el-timeline{
            text-align: left;
            .el-timeline-item{
                .el-timeline-item__wrapper{
                    .el-card{
                        background-color: rgba(255,255,255,.5);
                        h4{
                            cursor: pointer;
                        }
                        p{
                            font-size: 12px;
                            .delBtn{
                                float: right;
                                cursor: pointer;
                                margin-left: 20px;
                            }
                        }
                    }
                    .el-card:hover{
                        border: 1px solid #3cabcf;
                        background-color: rgba(255,255,255,1);
                    }
                }
            }
        }
        .demo-ruleForm{
            text-align: left;
        }
    }
}
</style>