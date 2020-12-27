<template>
    <el-main>
        <h3>关注列表</h3>
        <div v-if="focus.length">
            <div class="cardWrapper" v-for="(item, index) in focus" :key="index">
                <Card :item="item"></Card>
            </div>
            <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="currentPageChange">
            </el-pagination>
        </div>
        <p v-else>您还没有关注过任何人</p>
    </el-main>
</template>

<script>
import Card from '_c/Card/index.vue'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            focus: [],
            total: 0,
            page: 1
        }
    },
    components: {
        Card
    },
    methods: {
        currentPageChange(page){
            this.page = page
            this.getData()
        },
        getData(){
            let data = {
                _id: this.user._id,
                page: this.page
            }
            this.axios.post("/getFocusList", data)
            .then(res => {
                if(res.data.message === "OK"){
                    this.focus = res.data.focus
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
            'user',
            'focusArr'
        ])
    }
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    min-height: 400px;
    h3{
        text-align: left;
        border-left: 5px solid #3cabcf;
        margin: 1rem;
        padding-left: 10px;
    }
    p{
        text-align: left;
        padding-left: 20px;
    }
    .cardWrapper{
        background: rgba(255,255,255,.5);
        padding: 10px;
    }
    .el-pagination{
        margin: 20px;
    }
}
</style>