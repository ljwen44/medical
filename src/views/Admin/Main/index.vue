<template>
    <el-container>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
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
.el-container{
    .el-main{
        padding: 0;
    }
}
</style>