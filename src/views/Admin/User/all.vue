<template>
    <el-main>
        <div>
            <h3>普通用户</h3>
            <router-link to="/admin/user/moreUser?type=普通用户" tag="span">更多</router-link>
        </div>
        <el-table
            :data="userData"
            style="width: 100%">
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
        <br>
        <div>
            <h3>医生</h3>
            <router-link to="/admin/user/moreUser?type=医生" tag="span">更多</router-link>
        </div>
        <el-table
            :data="doctData"
            style="width: 100%">
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
import {userList} from '../../../lib/data'
export default {
    data() {
        return {
            userData: [],
            doctData: []
        }
    },
    methods: {
        handleEdit(_id) {
            this.$router.push({
                path: '/admin/user/detail',
                query: {
                    _id
                }
            })
        },
        getData(){
            this.axios.get("/getIndexUser")
            .then(res => {
                if(res.data.message === "OK"){
                    this.userData = res.data.users
                    this.doctData = res.data.doctors
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
        display: inline-block;
    }
    span{
        cursor: pointer;
        font-size: 14px;
    }
}
</style>