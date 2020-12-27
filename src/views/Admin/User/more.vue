<template>
    <el-main>
        <h3>{{type}}</h3>
        <el-input
            placeholder="请输入内容"
            v-model="search"
            @change="handleSearch"
            clearable>
        </el-input>
        <el-table
            :data="userData"
            style="width: 100%"
            v-if="type === '普通用户'">
            <el-table-column label="昵称" prop="userName"></el-table-column>
            <el-table-column label="手机号码" prop="phone"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column align="right">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.row._id)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-table
            :data="userData"
            style="width: 100%"
            v-else>
            <el-table-column label="真实姓名" prop="userName"></el-table-column>
            <el-table-column label="手机号码" prop="phone"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="工作单位" prop="work"></el-table-column>
            <el-table-column label="科目" prop="job"></el-table-column>
            <el-table-column align="right">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.row._id)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            search: '',
            userData: [],
            type: ''
        }
    },
    methods: {
        handleEdit(_id) {
            this.$router.push({
                path: '/admin/user/detail',
                query: {
                    _id: _id
                }
            })
        },
        getData(type){
            this.axios.get('/getUserByType', {params: {type}})
            .then(res => {
                if(res.data.message === "OK"){
                    this.userData = res.data.users
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
        },
        handleSearch(){
            let data = {
                userName: this.search,
                type: this.type
            }
            this.axios.post('/getUsersByIDandType', data)
            .then(res => {
                console.log(res.data)
                if(res.data.message === "OK"){
                    this.userData = res.data.users
                } else {
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("请求错误，请稍后重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        }
    },
    created() {
        this.type = this.$router.history.current.query.type
        this.getData(this.type)
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    .el-input{
        width: 50%;
    }
    h3{
        text-align: left;
        border-left: 5px solid #3cabcf;
        margin: 1rem;
        padding-left: 10px;
    }
}
</style>