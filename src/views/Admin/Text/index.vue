<template>
    <el-main>
        <el-row>
            <router-link to="/admin/userText/normal" tag="span">普通用户</router-link>
            <router-link to="/admin/userText/doctor" tag="span">医生</router-link>
        </el-row>
        <router-view></router-view>
    </el-main>
</template>

<script>
export default {
    data() {
        return {

        }
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    .el-row{
        border-bottom: 3px solid #7bd4f1;
        span{
            text-align: center;
            padding: 10px;
            width: 100px;
            display: inline-block;
            cursor: pointer;
        }
    }
}
</style>