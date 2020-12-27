<template>
    <el-main>
        <el-row>
            <h2>{{notice.title}}</h2>
            <p>{{notice.desc}}</p>
            <span>
                <i class="el-icon-time">发布时间:{{notice.time | timeFilter('yyyy-MM-dd hh:mm:ss')}}</i>
            </span>
        </el-row>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            notice: {}
        }
    },
    created() {
        this.id = this.$router.history.current.query._id
        this.getData()
    },
    methods: {
        getData(){
            this.axios.post("/getNoticeByID", {_id: this.id})
            .then(res => {
                if(res.data.message === "OK"){
                    this.notice = res.data.notice
                } else {
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("获取数据异常，请稍后重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        }
    },
}
</script>

<style lang='less' scoped>
.el-main{
    .el-row{
        min-height: 400px;
        box-shadow: 0 0 4px #ccc;
        padding: 10px;
        position: relative;
        h2{
            text-align: center;
            margin: 10px 0;
        }
        p{
            padding: 10px;
            line-height: 2;
        }
        span{
            padding-left: 10px;
            position: absolute;
            bottom: 15px;
        }
    }
}
</style>