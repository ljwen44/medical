<template>
    <el-main>
        <ul>
            <li class="recommened_li" v-for="(item, index) in list" :key="index">
                <el-avatar :src="item.avatar" @error="errorHandler">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
                <div class="avater_wrapper">
                    <div class="avater_top">
                        <router-link :to="'/userDetail?_id='+item._id" tag="span">{{item.userName}}</router-link>
                        <i class="iconfont icon-renzheng" :style="{color: item.auth ? 'green': 'grey'}">
                            {{item.auth ? '已认证': '未认证'}}
                        </i>
                    </div>
                    <div class="avater_bottom">
                        <span>粉丝: {{item.fans}}</span> 
                    </div>
                </div>
            </li>
        </ul>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    props: {
        list: Array
    },
    methods: {
        errorHandler(){
            return true
        }
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    .recommened_li{
        padding: 10px 0;
        .el-avatar{
            vertical-align: middle;
        }
        .avater_wrapper{
            padding-left: 10px;
            display: inline-block;
            vertical-align: middle;
            .avater_top{
                span{
                    vertical-align: middle;
                    font-size: 14px;
                    cursor: pointer;
                }
                i{
                    font-size: 12px;
                }
            }
            .avater_bottom{
                span{
                    font-size: 14px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin: 0;
                }
            }
        }
    }
}
</style>