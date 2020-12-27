<template>
    <el-container class="elContainer_footer_wrapper">
        <el-footer class="elContainer_footer">
            <router-link tag="div" to="/medical"><i class="el-icon-s-home"></i><br><span>首页</span></router-link>
            <router-link tag="div" to="/search"><i class="el-icon-search"></i><br><span>搜索</span></router-link>
            <router-link tag="div" to="/message"><i class="el-icon-message"></i><br><span>消息</span></router-link>
            <router-link tag="div" to="/user"><i class="el-icon-s-custom"></i><br><span>我的</span></router-link>
        </el-footer>
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
.elContainer_footer_wrapper{
    z-index: 11111;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    .elContainer_footer{
        background: #3cabcf;
        display: flex;
        div{
            display: inline-block;
            flex: 1;
            text-align: center;
            padding: 10px 0;
            color: #fff;
            i{
                font-size: 24px;
            }
        }
    }
}
@media screen and (min-width: 769px){
    .elContainer_footer_wrapper{
        display: none;
    }
}
</style>