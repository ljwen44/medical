<template>
    <el-header class="elHeader_index">
        <el-row type="flex" justify="center" align="space-between" class="elRow_index_header">
            <el-col :xs="6" :sm="10" :md="6" :lg="6" :xl="6">
                <router-link to="/medical">
                    <img src="../../assets/images/logo.png" alt="">
                </router-link>
            </el-col>
            <el-col :xs="18" :sm="14" :md="18" :lg="18" :xl="18">
                <div class="searchBox" v-if="!searchBox">
                    <el-input placeholder="请输入内容" v-model="search" @change="handleSearch">
                        <template slot="append">
                            <el-button 
                                type="primary" 
                                icon="el-icon-search" @click="handleSearch">搜索</el-button>
                        </template>
                    </el-input>
                </div>
                <div class="userBox">
                    <router-link to="/medical/login" tag="span" v-if="!user.userName">登录</router-link>
                    <div class="userInfoWrapper" v-else @click="goUser">
                        <el-avatar :size="40" :src="user.avatar || 'public/images/default.jpg'" @error="errorHandler">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                        </el-avatar>
                        <span>{{user.userName}}</span>
                    </div>
                    <span @click="logout" class="logout" v-if="user.userName">退出</span>
                </div>
            </el-col>
        </el-row>
    </el-header>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data() {
        return {
            search: ''
        }
    },
    methods: {
        errorHandler(){
            return true
        },
        goUser(){
            this.$router.push('/user')
        },
        logout(){
            this.$confirm('确定退出登录吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'primary'
            }).then(() => {
                this.axios.post("/saveExitData", {
                    uid: this.user._id,
                    visit: JSON.stringify(this.lastestVisited),
                    watch: JSON.stringify(this.lastestWatch),
                    like: JSON.stringify(this.likeArr),
                    chat: JSON.stringify(this.chatList),
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.$store.commit('DELUSER')
                        this.$message({
                            type: 'success',
                            message: '退出成功!'
                        })
                        this.$router.push('/medical/login')
                    }
                }).catch(err => {
                    this.$message({
                        type: 'warning',
                        message: '退出失败，请稍后重试！'
                    }) 
                })
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                })       
            })
        },
        handleSearch(){
            this.search = this.search.trim()
            if(!this.search){
                return 
            } else {
                this.$router.push({
                    path: '/search',
                    query: {
                        search: this.search
                    }
                })
            }
        }
    },
    computed: {
        ...mapState([
            'searchBox',
            'user',
            'lastestVisited',
            'lastestWatch',
            'likeArr',
            'chatList'
        ])
    },
    created() {
        let localUser = localStorage._user_
        if(localUser){
            let User = JSON.parse(localUser)
            if(User.type === "管理员"){
                this.$router.push("/admin")
            } else {
                this.$store.commit('SETUSER', User)
            }
        }
        let localFocus = localStorage._user_focus_
        if(localFocus){
            this.$store.commit('SETFOCUS', JSON.parse(localFocus))
        }
        let visit = localStorage._user_visit_
        if(visit){
            this.$store.commit('SETVISIT', JSON.parse(visit))
        }
        let watch = localStorage._user_watch_
        if(watch){
            this.$store.commit('SETWATCH', JSON.parse(watch))
        }
        let like = localStorage._user_like_
        if(like){
            this.$store.commit('SETLIKE', JSON.parse(like))
        }
        let chat = localStorage._user_chat_
        if(chat){
            this.$store.commit('INITCHATLIST', JSON.parse(chat))
        }
    }
}
</script>

<style lang='less' scoped>
.elHeader_index{
    z-index: 1111;
    background: #3cabcf;
    height: 60px;
    position: fixed;
    width: 100%;
    top: 0;
    color:#fff;
    .elRow_index_header{
        height: inherit;
        line-height: 60px;
        .searchBox{
            float: left;
            width: 50%;
        }
        .userBox{
            .userInfoWrapper{
                display: inline-block;
                .el-avatar {
                    vertical-align: middle;
                    margin-right: 10px;
                }
            }
            .logout{
                margin-left: 30px;
                font-size: 14px;
            }
        }
    }
    .elRow_index_header div:first-child{
        img{
            height: 100%;
        }
    }
    .elRow_index_header div:last-of-type{
        text-align: right;
        span{
            cursor: pointer;
        }
    }
}
@media screen and (max-width: 769px){
    .searchBox{
        display: none;
    }
}
@media screen and (min-width: 769px) and (max-width: 992px){
    .elHeader_index{
        .elRow_index_header div:first-child{
            img{
                width: 50%;
            }
        }
    }
}
@media screen and (min-width: 993px) and (max-width: 1200px){
    .elHeader_index{
        .elRow_index_header div:first-child{
            img{
                width: 60%;
            }
        }
    }
}
@media screen and (min-width: 1201px){
    .elHeader_index{
        .elRow_index_header div:first-child{
            img{
                width: 60%;
            }
        }
    }
}
</style>