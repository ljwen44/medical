<template>
    <el-main>
        <h3>首页轮播图</h3>
        <router-link to="/admin/main/edit">
            <el-button type="primary">新建</el-button>
        </router-link>
        <el-table
            :data="dataList"
            style="width: 100%">
            <el-table-column label="id" prop="_id"></el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="描述" prop="desc"></el-table-column>
            <el-table-column label="图片" prop="img">
                <template slot-scope="scope">
                    <img
                    width="150"
                    :src="scope.row.img"
                    preview="1" />
                </template>
            </el-table-column>
            <el-table-column label="时间" prop="time">
                <template slot-scope="scope">
                    {{scope.row.time | timeFilter("yyyy-MM-dd hh:mm:ss")}}
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        handleEdit(index, obj){
            this.$router.push({
                path: '/admin/main/edit?', 
                query: {data: JSON.stringify(obj)}
            })
        },
        handleDel(index, _id){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post("/delBanner", {_id})
                .then(res => {
                    if(res.data.message === "OK"){
                        this.$alert("删除成功", "提示", {
                            confirmButtonText: "确定",
                            callback: action => {
                                this.dataList.splice(index, 1)
                            }
                        })
                    } else {
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    }
                }).catch(err => {
                    this.$alert("删除失败，请稍后重试！", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })   
            })
        },
        getData(){
            this.axios.get("/getAllBanner")
            .then(res => {
                this.dataList = res.data.banners
            }).catch(err => {
                console.log(err)
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