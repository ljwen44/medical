<template>
    <el-main class="replyWrapper">
        <el-row class="replyHeader">
            <p class="userInfo">
                <el-avatar :size="40" :src="item.user[0].avatar" @error="errorHandler">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
                <span>{{item.user[0].userName}}</span>
                <span class="commentTime">{{item.text[0].time | timeFilter('yyyy-MM-dd hh:mm:ss')}}</span>
            </p>
            <p class="comment">{{item.desc}}</p>
        </el-row>
        <el-row class="reply">
            <router-link :to="'/detail?_id='+item.text[0]._id+'&uid='+uid" tag="h4">{{item.text[0].title}}</router-link>
        </el-row>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        errorHandler(){
            return true
        }
    },
    props: {
        item: Object,
        uid: String
    },
}
</script>

<style lang='less' scoped>
.replyWrapper{
    background: rgba(255,255,255,.5);
    .replyHeader{
        text-align: left;
        .userInfo{
            color: #1d1616;
            font-size: 14px;
            .el-avatar{
                margin-right: 20px;
                vertical-align: middle;
            }
            .commentTime{
                margin-left: 30px;
                color: #ccc;
                font-size: 12px;
            }
        }
        .comment{
            margin: 10px;
            color: #100d0d;
            font-size: 14px;
        }
    }
    .reply{
        text-align: left;
        h4{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            cursor: pointer;
        }
    }
}
</style>