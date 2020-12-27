<template>
    <el-main>
        <el-row>
            <el-input v-model="search" placeholder="请输入文章标题"></el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-row>
        <el-row>
            <el-table
                :data="tableList"
                style="width: 100%">
                <el-table-column label="日期">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.time | timeFilter('yyyy-MM-dd hh:mm:ss') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="标题">
                    <template slot-scope="scope">
                        <p>{{ scope.row.title }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="阅读量">
                    <template slot-scope="scope">
                        <p>{{ scope.row.read | numFilter }}次</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.row._id, scope.row.uid)">查看</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="currentPageChange">
            </el-pagination>
        </el-row>
    </el-main> 
</template>

<script>
export default {
    data() {
        return {
            search: '',
            tableList: [],
            page: 1,
            total: 0
        }
    },
    methods: {
        getData(){
            this.axios.post("/getUserText",{
                type: "医生",
                title: this.search.trim()
            }).then(res => {
                if(res.data.message === "OK"){
                    this.tableList = res.data.texts
                    this.total = res.data.total
                } else {
                    this.$alert("获取数据异常，请稍后重试！", "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("获取数据异常，请稍后重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleSearch(){
            this.getData()
        },
        currentPageChange(page){
            this.page = page
            this.getData()
        },
        handleEdit(id, uid) {
            this.$router.push({
                path: "/admin/userText/detail",
                query: {
                    tid: id,
                    uid
                }
            })
        },
        handleDelete(index, id) {
            this.$prompt('请输入删除的原因：','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({value}) => {
                this.axios.post("/delUserText", {
                    tid: this.tableList[index]._id,
                    uid: this.tableList[index].uid,
                    desc: value,
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.tableList.splice(index, 1)
                        this.$message({
                            message: '删除成功!',
                            type: 'success'
                        })
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
    },
    created() {
        this.getData()
    },
}
</script>

<style lang='less' scoped>
.el-main{
    .el-row{
        margin-top: 10px;
        .el-input{
            width: 30%;
        }
        .el-pagination {
            text-align: center;
        }
    }
}
</style>