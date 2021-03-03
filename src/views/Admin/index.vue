<template>
    <el-container class="elContainer_admin">
        <!-- 管理员页面顶部 -->
        <el-header class="elHeader_admin" height="10vh">
            <el-row type="flex" justify="center" align="space-between" class="elRow_admin_header">
                <el-col :sm="4" :md="4" :lg="4" :xl="2">
                    <img src="../../assets/images/logo.png" alt="">
                </el-col>
                <el-col :sm="20" :md="20" :lg="20" :xl="22" class="adminInfo">
                    <div>
                        {{user.userName}}
                        <span @click="logout">退出</span>
                    </div>
                </el-col>
            </el-row>
        </el-header>

        <!-- 管理员页面主要内容 -->
        <el-container style="border-top: 1px solid #8bc3ea;">
            <el-aside width="15%" height="90vh" class="elAside_admin">
                <div class="admin_info">
                    <img :src="user.avatar" alt="">
                    <p>{{user.userName}}</p>
                </div>
                <el-menu
                    :router="true"
                    :default-active="$route.path"
                    :unique-opened="true"
                    class="el-menu-vertical-demo">
                    <el-menu-item index="/admin/analysis">
                        <i class="el-icon-s-marketing"></i>
                        <span slot="title">数据统计</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/main">
                        <i class="el-icon-s-home"></i>
                        <span slot="title">轮播图管理</span>
                    </el-menu-item>
                    <el-submenu index="/admin/user">
                        <template slot="title">
                            <i class="el-icon-user"></i>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/admin/user/auth">
                                <i class="el-icon-user-solid ileft"></i>认证管理
                            </el-menu-item>
                            <el-menu-item index="/admin/user/all">
                                <i class="el-icon-document"></i>查看用户
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="/admin/pub">
                        <template slot="title">
                            <i class="el-icon-document"></i>
                            <span>公告管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/admin/pub/allPub">
                                <i class="el-icon-document"></i>
                                <span slot="title">查看公告</span>
                            </el-menu-item>
                            <el-menu-item index="/admin/pub/pubText">
                                <i class="el-icon-edit-outline"></i>
                                <span slot="title">发布公告</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item index="/admin/userText/normal">
                        <i class="el-icon-notebook-2"></i>
                        <span slot="title">文章管理</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/security">
                        <i class="el-icon-setting"></i>
                        <span slot="title">安全中心</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main class="elMain_admin">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            uid: ''
        }
    },
    methods: {
        getData(){
            this.axios.post("/getAdminData", {
                uid: this.uid
            }).then(res => {
                if(res.data.message === "OK"){
                    this.$store.commit('SETUSER', res.data.user)
                } else {
                    this.$alert("获取用户数据异常，请稍后登录", "提示", {
                        confirmButtonText: "确定",
                        callback: () => {
                            this.$router.push('/medical/login')
                        }
                    })
                }
            }).catch(err => {
                this.$alert("获取用户数据异常，请稍后登录", "提示", {
                    confirmButtonText: "确定",
                    callback: () => {
                        this.$router.push('/medical/login')
                    }
                })
            })
        },
        logout(){
            this.$confirm('确定要退出吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.commit("DELUSER")
                this.$message({
                    type: 'success',
                    message: '退出成功!'
                })
                this.$router.push("/medical/login")
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消退出'
                })       
            })
        }
    },
    created() {
        let localUser = localStorage.getItem('_user_')
        if(localUser){
            this.$store.commit('SETUSER', JSON.parse(localUser))
        } else {
            this.uid = this.$router.history.current.query.uid
            this.getData()
        }
    },
    computed: {
        ...mapState([
            'user'
        ])
    }
}
</script>

<style lang='less' scoped>
.elContainer_admin{
    .elHeader_admin{
        background: #7bd4f1;
        .elRow_admin_header{
            height: inherit;
            line-height: 10vh;
            img{
                width: 100%;
                height: 100%;
            }
            .adminInfo{
                text-align: right;
                color: #fff;
                span{
                    margin-left: 20px;
                    cursor: pointer;
                }
                span:hover{
                    color: #000;
                }
            }
        }
    }
    .elAside_admin{
        background: #7bd4f1;
        min-height: 90vh;
        .admin_info{
            padding: 10px;
            text-align: center;
            img{
                width: 100px;
                height: 100px;
                border-radius: 50%;
            }
            p{
                color: #fff;
            }
        }
        .el-menu{
            background: transparent;
        }
    }
}
</style>