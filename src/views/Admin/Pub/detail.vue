<template>
    <el-main>
        <h2>{{obj.title}}</h2>
        <p>{{obj.desc}}</p>
        <p>发布时间： {{obj.time | timeFilter("yyyy-MM-dd hh:mm:ss")}}</p>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            obj: {}
        }
    },
    methods: {
        getData(_id){
            this.axios.get("/getNoticeByID", {params: {_id}})
            .then(res => {
                if(res.data.message === "OK"){
                    this.obj = res.data.notice[0]
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
    created() {
        let _id = this.$router.history.current.query._id
        this.getData(_id)
    },
}
</script>

<style lang='less' scoped>
.el-main{
    h2{
        text-align: center;
    }
    p{
        margin: 3% 0;
    }
}
</style>