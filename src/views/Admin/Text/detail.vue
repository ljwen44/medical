<template>
    <el-main class="detail_wrapper">
        <div class="content_header">
            <el-avatar :size="50" :src="author.avatar" @error="errorHandler" class="avater">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
            </el-avatar>
            <router-link :to="'/userDetail?_id='+author._id" tag="span" class="userName">{{author.userName}}</router-link>
            <el-tag type="info" class="flag" v-if="author.type === '医生'">
                <i class="iconfont icon-renzheng" :style="{color: author.auth ? 'green': 'grey'}">
                    {{author.auth ? '已认证': '未认证'}}
                </i>
            </el-tag>
        </div>
        <div class="content_main">
            <h3>{{text.title}}</h3>
            <p>{{text.desc}}</p>
        </div>
        <div class="content_footer">
            <p>
                <i class="el-icon-time">发布时间:</i>{{text.time | timeFilter('yyyy-MM-dd hh:mm:ss')}}
            </p>
            <p>
                <i class="el-icon-reading">阅读量:</i>{{text.read | numFilter}}次浏览量
            </p>
        </div>
        <el-button type="danger" @click="handleDel">
            删除
        </el-button>
        <el-button type="primary" @click="handleBack">
            返回
        </el-button>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            text: {},
            author: {},
            tid: '',
            uid: ''
        }
    },
    methods: {
        getData(){
            this.axios.post("/getTextByID", {
                _id: this.tid,
                uid: this.uid
            }).then(res => {
                console.log(res.data)
                if(res.data.message === "OK"){
                    this.text = res.data.text
                    this.author = res.data.user
                } else {
                    this.$alert("获取数据失败，请稍后重试！", "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("获取数据失败，请稍后重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        errorHandler(){
            return true
        },
        handleDel(){
            this.$prompt('请输入删除的原因：','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({value}) => {
                this.axios.post("/delUserText", {
                    tid: this.text._id,
                    uid: this.uid,
                    desc: value,
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.$message({
                            message: '删除成功!',
                            type: 'success'
                        })
                        this.$router.go(-1)
                    } else{
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    }
                }).catch(err => {
                    this.$alert("删除失败，请稍后重试！", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }).catch(()=>{
                this.$message({
                    type: 'warning',
                    message: '已取消!'
                })
            })
        },
        handleBack(){
            this.$router.go(-1)
        }
    },
    created() {
        this.tid = this.$router.history.current.query.tid
        this.uid = this.$router.history.current.query.uid
        this.getData()
    },
}
</script>

<style lang='less' scoped>
.detail_wrapper{
    box-shadow: 0 0 4px #ccc;
    margin: 10px;
    border-radius: 4px;
    padding: 10px;
    .content_header{
        line-height: 50px;
        .avater{
            vertical-align: middle;
            img{
                vertical-align: middle;
                margin-right: 10px;
            }
        }
        .userName{
            color: #4a3a3a;
            font-size: 16px;
            margin-left: 10px;
            cursor: pointer;
        }
        .flag{
            background: none;
            border: none;
            i{
                font-size: 12px;
            }
        }
    }
    .content_main{
        padding: 10px 0;
        h3{
            margin: 5px 0;
        }
        p{
            margin: 15px 0;
            text-indent: 20px;
        }
    }
    .content_footer{
        font-size: 14px;
        color: #ccc;
        p{
            font-size: 16px;
            padding: 10px 0;
            i{
                margin-right: 10px;
            }
        }
    }
}
</style>