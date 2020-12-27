<template>
    <div>
        <div class="content_header">
            <el-avatar :size="40" :src="item.user[0].avatar" @error="errorHandler" class="avater">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
            </el-avatar>
            <router-link :to="'/userDetail?_id='+item.user[0]._id" class="userName" tag="span">
                {{item.user[0].userName}}
            </router-link>
            <el-tag type="info" class="flag" v-if="item.user[0].type === '医生'">
                医生
                <i class="iconfont icon-renzheng" :style="{color: item.user[0].auth ? 'green': 'grey'}">
                    {{item.user[0].auth ? '已认证': '未认证'}}
                </i>
            </el-tag>
        </div>
        <div class="content_main">
            <router-link tag="h3" :to="'/detail?_id='+item._id+'&uid='+item.uid">{{item.title}}</router-link >
            <p>{{item.desc}}</p>
        </div>
        <div class="content_footer">
            <i class="el-icon-time">{{item.time | timeFilter('yyyy-MM-dd hh:mm:ss')}}</i>
            <i class="iconfont icon-dianzan icon" 
                :style="{color: likeArr.includes(item._id) ? 'red' : '#ccc'}" 
                @click="dianzan(item._id)">
                {{item.like | numFilter}}</i>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
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
        },
        dianzan(id){
            if(!this.user._id){
                this.$message("登录后即可操作")
                return 
            }
            if(this.likeArr.includes(id)){
                this.$message("您已点过赞~")
            } else {
                this.axios.post('/addLike', {
                    _id: id
                }).then(res => {
                    if(res.data.message === 'OK'){
                        this.$store.commit('ADDLIKE', id)
                        this.item.like++
                    } else {
                        this.$message("点赞失败!")
                    }
                }).catch(err => {
                    this.$message("点赞失败!")
                })
            }
        }
    },
    computed: {
        ...mapState([
            'user',
            'likeArr'
        ])
    }
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
    h3{
        margin: 0;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        cursor: pointer;
    }
    p{
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        margin: 10px;
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