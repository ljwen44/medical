<template>
    <el-container>
        <el-main>
            <el-input placeholder="请输入内容" v-model="search" @change="handleSearch">
                <template slot="append">
                    <el-button 
                        type="primary" 
                        icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </template>
            </el-input>
            <h3>查询结果:共{{total}}条数据</h3>
            <transition name="el-fade-in-linear">
                <ul v-if="list.length">
                    <li v-for="(item, index) in list" :key="index">
                        <Article :item="item"></Article>
                    </li>
                </ul>
            </transition>
            <el-pagination
                v-if="list.length"
                background
                layout="prev, pager, next"
                :total="total"
                @current-change="currentPageChange">
            </el-pagination>
        </el-main>
    </el-container>
</template>
<script>
import Article from '_c/Article/index.vue'
export default {
    data() {
        return {
            search: '',
            page: 1,
            list: [],
            total: 0
        }
    },
    components: {
        Article
    },
    methods: {
        getTotal(){
            this.axios.post("/getTotalBySearch", {
                title: this.search
            }).then(res => {
                if(res.data.message === 'OK'){
                    this.total = res.data.total
                    console.log(this.total)
                } else {
                    this.$message(res.data.message)
                }
            }).catch(err => {
                this.$message("获取数据异常，请稍后重试！")
            })
        },
        getData(){
            this.axios.post("/getTextBySearch", {
                page: this.page,
                title: this.search
            }).then(res => {
                if(res.data.message === 'OK'){
                    this.list = res.data.data
                } else {
                    this.$message(res.data.message)
                }
            }).catch(err => {
                this.$message("获取数据异常，请稍后重试！")
            })
        },
        currentPageChange(page){
            this.page = page
            this.getData()
        },
        handleSearch(){
            this.getTotal()
            this.getData()
        }
    },
    created() {
        this.search = this.$router.history.current.query.search
        this.getTotal()
        this.getData()
    },
    beforeCreate() {
        this.$store.commit("SETSEARCH", true)
    },
    beforeDestroy() {
        this.$store.commit("SETSEARCH", false)
    }
}
</script>

<style lang='less' scoped>
.el-container{
    .el-main{
        .el-input{
            margin-bottom: 20px;
            width: 40%;
        }
        h3{
            border-left: 5px solid #3cabcf;
            padding-left: 10px;
        }
        ul{
            li{
                margin: 20px 0;
                box-shadow: 0 0 4px #ccc;
                padding: 10px;
            }
            li:hover{
                box-shadow: 0 0 4px #3cabcf;
            }
        }
        .el-pagination{
            text-align: center;
        }
    }
}
</style>