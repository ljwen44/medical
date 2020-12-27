<template>
    <el-main>
        <h3>系统通知</h3>
        <el-timeline v-if="sysList.length">
            <el-timeline-item :timestamp="item.time | timeFilter('yyyy-MM-dd')" placement="top" v-for="(item, index) in sysList" :key="index">
                <el-card>
                    <h4>{{item.desc}}</h4>
                    <p>{{item.time | timeFilter('yyyy-MM-dd hh:mm:ss')}}</p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
        <p style="text-align: left;" v-else>您还没有接收到任何系统通知</p>
    </el-main>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data() {
        return {
            sysList: []
        }
    },
    methods: {
        getData(uid){
            this.axios.get('/getSysByID', {
                params: {uid}
            }).then(res => {
                if(res.data.message === "OK"){
                    this.sysList = res.data.sys
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
        this.getData(this.user._id)
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
    min-height: 500px;
    h3{
        border-left: 5px solid #3cabcf;
        padding-left: 10px;
        text-align: left;
        margin-bottom: 20px;
    }
    .el-timeline{
        text-align: left;
        .el-timeline-item{
            .el-timeline-item__wrapper{
                .el-card{
                    background-color: rgba(255,255,255,.5);
                    h4{
                        cursor: pointer;
                        margin-bottom: 20px;
                    }
                    p{
                        font-size: 12px;
                    }
                }
                .el-card:hover{
                    border: 1px solid #3cabcf;
                    background-color: rgba(255,255,255,1);
                }
            }
        }
    }
}
</style>