<template>
    <section>
        <div class="content_header">
            <el-avatar :size="40" :src="item.user[0].avatar" @error="errorHandler" class="avater">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
            </el-avatar>
            <router-link tag="span" :to="'/userDetail?_id='+item.user[0]._id" class="userName">{{item.user[0].userName}}</router-link>
            <el-tag type="info" class="flag">
                <i class="iconfont icon-renzheng" :style="{color: item.user[0].auth ? 'green': 'grey'}">
                    {{item.user[0].auth ? '已认证': '未认证'}}
                </i>
            </el-tag>
        </div>
        <div class="content_main">
            <p>{{item.desc}}</p>
        </div>
        <div class="content_footer">
            <i class="el-icon-time">{{item.time | timeFilter('yyyy-MM-dd hh:mm:ss')}}</i>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: {
        item: Object
    },
    methods: {
        errorHandler(){
            return true
        }
    },
}
</script>

<style lang='less' scoped>
.content_header{
    line-height: 50px;
    .avater{
        vertical-align: middle;
        img{
            vertical-align: middle;
            margin-right: 10px;
        }
    }
    .userName{
        color: #4a3a3a;
        font-size: 14px;
        margin-left: 10px;
        cursor: pointer;
    }
    .flag{
        background: none;
        border: none;
        i{
            font-size: 12px;
        }
    }
}
.content_main{
    p{
        margin: 15px 0;
    }
}
.content_footer{
    font-size: 12px;
    color: #ccc;
    .icon{
        float: right;
        cursor: pointer;
    }
}
</style>