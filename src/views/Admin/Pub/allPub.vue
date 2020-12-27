<template>
    <el-main>
        <h3>公告</h3>
        <el-table
            :data="dataList"
            style="width: 100%">
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="描述" prop="desc"></el-table-column>
            <el-table-column label="时间" prop="time">
                <template slot-scope="scope">
                    {{scope.row.time | timeFilter("yyyy-MM-dd hh:mm:ss")}}
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleWatch(scope.row._id)">查看</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDel(scope.$index, scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            dataList: []
        }
    },
    methods: {
        handleWatch(_id){
            this.$router.push({
                path: "/admin/pub/pubDetail",
                query: {
                    _id
                }
            })
        },
        handleDel(index, _id){
            this.$confirm('您确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post("/delNoticeByID", {_id})
                .then(res => {
                    if(res.data.message === "OK"){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.dataList.splice(index, 1)
                    } else {
                        this.$alert(res.data.message, "提示",{
                            confirmButtonText: "确定"
                        })
                    }
                }).catch(err => {
                    this.$alert("删除失败，请稍后重试！","提示",{
                        confirmButtonText: "确定"
                    })
                })
            })
        },
        getData(_id){
            this.axios.get("/getNoticeByID", {params: {_id}})
            .then(res => {
                if(res.data.message === "OK"){
                    this.dataList = res.data.notice
                } else {
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("获取数据失败，请稍后重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        }
    },
    created() {
        this.getData()
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