<template>
    <el-container class="userWrapper">
        <el-main class="bgAvater">
            <img src="../../assets/images/bg.jpg" alt="" class="bgImg">
            <el-main class="main">
                <el-row>
                    <el-col :sm="8" :md="5" class="aside">
                        <div class="userInfoWrapper">
                            <el-avatar :size="70" :src="user.avatar" @error="errorHandler" class="user_avater">
                                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                            </el-avatar>
                            <p style="margin: 10px 0;">{{user.userName}}</p>
                            <el-tag type="info" class="flag" v-if="user.type === '医生'">
                                <i class="iconfont icon-renzheng" :style="{color: user.auth ? 'green': 'grey'}">
                                    {{user.auth ? '已认证': '未认证'}}
                                </i>
                            </el-tag>
                            <p> 关注数: {{user.focus | numFilter}} | 粉丝数: {{user.fans | numFilter}}</p>
                        </div>
                        <el-menu
                            :router="true"
                            :default-active="$route.path"
                            :unique-opened="true"
                            class="el-menu-vertical-demo">
                            <el-menu-item index="/user/myzl">
                                <i class="el-icon-document"></i>
                                <span slot="title">我的资料</span>
                            </el-menu-item>
                            <el-submenu index="/user/mymessage">
                                <template slot="title">
                                    <i class="el-icon-chat-dot-round"></i>
                                    <span>我的消息</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/user/mymessage/private">
                                        <i class="el-icon-message ileft"></i>我的私信
                                    </el-menu-item>
                                    <el-menu-item index="/user/mymessage/reply">
                                        <i class="el-icon-chat-line-square ileft"></i>我的回复
                                    </el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                            <el-submenu index="/user/frilist">
                                <template slot="title">
                                    <i class="el-icon-user"></i>
                                    <span>好友列表</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/user/frilist/myfocus">
                                        <i class="el-icon-user-solid ileft"></i>我的关注
                                    </el-menu-item>
                                    <el-menu-item index="/user/frilist/myfans">
                                        <i class="el-icon-user-solid ileft"></i>我的粉丝
                                    </el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                            <el-menu-item index="/user/mypub">
                                <i class="el-icon-s-promotion"></i>
                                <span slot="title">我的发布</span>
                            </el-menu-item>
                            <el-menu-item index="/user/security">
                                <i class="el-icon-setting"></i>
                                <span slot="title">安全中心</span>
                            </el-menu-item>
                            <el-menu-item index="/user/sysNotice">
                                <i class="el-icon-bell"></i>
                                <span slot="title">系统通知</span>
                            </el-menu-item>
                        </el-menu>
                    </el-col>
                    <el-col :sm="16" :md="19" class="mainWrapper">
                        <router-view></router-view>
                    </el-col>
                </el-row>
            </el-main>
        </el-main>
    </el-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {

        }
    },
    methods: {
        errorHandler() {
            return true
        }
    },
    computed: {
        ...mapState(
            [
                'user'
            ]
        )
    },
    mounted() {
        let uid = this.user._id
        if(!uid){
            this.$alert('请先登录！', '提示', {
                confirmButtonText: '确定',
                callback: (action) => {
                    this.$router.push('/medical/login')
                }
            })
        }
    },
}
</script>

<style lang='less' scoped>
.userWrapper{
    position: relative;
    .bgImg{
        position: absolute;
        left: 0;
        width: 100%;
        z-index: 0;
        filter: blur(5px);
    }
    .bgAvater{
        position: relative;
        padding: 0;
        text-align: center;
        z-index: 111;
        .main{
            position: relative;
            background: rgba(200,219,239, .8);
            margin-top: 15%;
            margin: 10% 5% 0 5%;
            box-shadow: 0 0 4px #ccc;
            .aside{
                background: #fff;
                border-right: solid 1px #e6e6e6;
                .userInfoWrapper{
                    margin: 20px 0;
                }
                .el-menu{
                    border-right: 0;
                }
            }
            .mainWrapper{
                background: #fff;
            }
        }
    }
    .flag{
        background: none;
        border: none;
        i{
            font-size: 12px;
        }
    }
}
.ileft{
    margin-left: 40px;
}
@media screen and(max-width: 506px){
    .user_main{
        margin-top: 5%;
    }
}
@media screen and(min-width: 507px) and(max-width: 768px){
    .bgImg{
        height: 200px;
    }
    .user_main{
        margin-top: 5%;
    }
}
@media screen and(min-width: 769px) and(max-width: 992px){
    .bgImg{
        height: 300px;
    }
    .user_main{
        margin-top: 5%;
    }
}
@media screen and(min-width: 993px){
    .bgImg{
        height: 400px;
    }
    .user_main{
        margin-top: 2%;
    }
}
</style>