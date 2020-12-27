<template>
    <el-main>
        <h3>详细资料</h3>
        <div class="box">
            <img :src="user.avatar" alt="">
        </div>
        <h3>基本信息</h3>
        <div class="box">
            <p>
                <span>昵称：{{user.userName}}</span>
                <span>性别：{{user.sex}}</span>
            </p>
            <p>
                <span>出生年月： {{user.bir | timeFilter('yyyy-MM-dd')}}</span>
            </p>
            <p>
                <span>手机号码： {{user.phone}}</span>
                <span>邮箱：{{user.email}}</span>
            </p>
            <p v-if="user.type === '医生'">
                <span>工作单位：{{user.work}}</span>
                <span>科目：{{user.job}}</span>
            </p>
        </div>
        <h3>个人简介</h3>
        <div class="box">
            <p>{{user.introduce}}</p>
        </div>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            user: {}
        }
    },
    methods: {
        getData(_id){
            this.axios.post('getUserByID', {_id})
            .then(res => {
                if(res.data.message === "OK"){
                    this.user = res.data.user
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
        this.getData(this.$router.history.current.query._id)
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
    .box{
        padding: 0 10px;
        text-align: left;
        margin-bottom: 20px;
        h3{
            border-left: 5px solid #3cabcf;
            padding-left: 10px;
        }
        p{
            margin: 5px 0;
            padding: 10px;
            display: flex;
            span{
                flex: 1;
            }
        }
        img{
            width: 200px;
            height: 200px;
        }
    }
}
</style>