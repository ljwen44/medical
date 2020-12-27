<template>
    <el-container class="elContainer_index">
        <Header></Header>
        <!-- 页面主要内容 -->
        <el-main class="elMain_wrapper">
            <router-view></router-view>
        </el-main>
        <Footer></Footer>
    </el-container>
</template>

<script>
import Header from '_c/Header/index.vue'
import Footer from '_c/Footer/index.vue'
export default {
    data() {
        return {
            circleUrl: '../../assets/images/logo.png'
        }
    },
    methods: {
    },
    components: {
        Header,
        Footer
    }
}
</script>

<style lang='less' scoped>
.elContainer_index{
    .elMain_wrapper{
        margin: 60px 0;
        padding: 0;
        background: #fff;
    }
}
</style>