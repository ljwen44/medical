<template>
    <el-main class="rWrapper">
        <h3>我的回复</h3>
        <div v-if="commentList.length">
            <el-row v-for="(item, index) in commentList" :key="index">
                <Reply :item="item"></Reply>
            </el-row>
            <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="currentPageChange">
            </el-pagination>
        </div>
        <p v-else>还没有人评论你哦~</p>
    </el-main>
</template>

<script>
import Reply from '_c/Reply/index.vue'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            commentList: [],
            total: 0,
            page: 1
        }
    },
    components: {
        Reply
    },
    methods: {
        currentPageChange(page){
            this.page = page
            this.getData()
        },
        getData(){
            this.axios.post("/getCommentByUID", {
                uid: this.user._id,
                page: this.page
            }).then(res => {
                if(res.data.message === "OK"){
                    this.commentList = res.data.data
                    this.total = res.data.total
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
        this.getData()
    },
    computed: {
        ...mapState([
            'user'
        ])
    }
}
</script>

<style lang='less' scoped>
.rWrapper{
    min-height: 400px;
    h3{
        text-align: left;
        border-left: 5px solid #3cabcf;
        margin: 1rem;
        padding-left: 10px;
    }
    p{
        text-align: left;
        padding: 20px;
    }
    .el-row{
        border-bottom: 1px solid #ccc;
    }
    .el-pagination{
        margin-top: 20px;
    }
}
</style>