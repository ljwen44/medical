<template>
    <el-container>
        <el-main>
            <el-row>
                <el-col :sm="18" :md="18">
                    <div class="userBox">
                        <img :src="userInfo.avatar" alt=""><br>
                        <el-button 
                            :type="focusArr.includes(uid)?'info':'success'" 
                            style="margin: 10px 0;" 
                            @click="handleFocus(focusArr.includes(uid))"
                            v-if="uid !== user._id"
                        >{{focusArr.includes(uid)?'取消关注':'关注'}}</el-button>
                        <el-button 
                            type="primary" 
                            style="margin: 10px 10px;" 
                            @click="handleChat"
                            v-if="uid !== user._id"
                        >私聊</el-button>
                    </div>
                    <div class="userBox">
                        <h3>基础资料</h3>
                        <p>
                            <span>昵称：{{userInfo.userName}}</span>
                        </p>
                        <p>
                            <span>出生年月： {{userInfo.bir | timeFilter('yyyy-MM-dd')}}</span>
                            <span>性别：{{userInfo.sex}}</span>
                        </p>
                        <p>
                            <span>手机号码： {{userInfo.phone}}</span>
                            <span>邮箱：{{userInfo.email}}</span>
                        </p>
                        <p v-if="userInfo.type === '医生'">
                            <span>工作单位：{{userInfo.work}}</span>
                            <span>科目：{{userInfo.job}}</span>
                        </p>
                    </div>
                    <div class="userBox">
                        <h3>个人简介</h3>
                        <p class="userTro">{{userInfo.introduce}}</p>
                    </div>
                    <div class="userBox">
                        <h3>他的文章</h3>
                        <div class="pubBox">
                            <ul v-if="textList.length">
                                <li v-for="(item, index) in textList" :key="index">
                                    <router-link :to="'/detail?_id='+item._id+'&uid='+item.uid" tag="span">{{item.title}}</router-link>
                                </li>
                            </ul>
                            <p v-else>他还没有发表过文章哦~</p>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="6" :md="6">
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import Card from '_c/Card/index.vue'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            userInfo: {},
            textList: [],
            uid: ''
        }
    },
    methods: {
        errorHandler(){
            return true
        },
        getInfo(id){
            this.axios.post("/getUserByID", {_id: id})
            .then(res => {
                if(res.data.message === "OK"){
                    this.userInfo = res.data.user
                    this.userInfo.phone = this.userInfo.phone.substring(0,3) + '****' + this.userInfo.phone.substring(7,11)
                    if(this.user._id){
                        this.$store.commit('ADDNEWVISITED', this.userInfo)
                    }
                } else {
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("获取数据异常，请稍后重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        getUserText(id){
            this.axios.get("/getText", {
                params: {uid: id}
            })
            .then(res => {
                if(res.data.message === "OK"){
                    this.textList = res.data.data
                } else {
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("获取数据异常，请稍后重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        handleFocus(flag){
            if(!flag){
                if(!this.user._id){
                    this.$alert("登录后即可关注", "提示", {
                        confirmButtonText: "确定"
                    })
                    return 
                }
                let data = {
                    uid: this.user._id,
                    cuid: this.uid
                }
                this.axios.post("/focusUser", data)
                .then(res => {
                    if(res.data.message === "OK"){
                        this.user.focus++
                        this.$store.commit('SETUSER', this.user)
                        this.$store.commit('ADDFOCUS', this.uid)
                    }
                }).catch(err => {
                    this.$message("关注失败，请稍后重试！")
                })
            } else {
                this.axios.post("/cancelFocusUser", {
                    uid: this.user._id,
                    cuid: this.uid
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.user.focus--
                        this.$store.commit('SETUSER', this.user)
                        this.$store.commit('DELFOCUS', this.uid)
                    } else {
                        this.$message("取消失败，请稍后重试！")
                    }
                }).catch(err => {
                    this.$message("取消失败，请稍后重试！")
                })
            }
        },
        handleChat(){
            if(!this.user._id){
                this.$alert("请先登录!", "提示", {
                    confirmButtonText: "确定"
                })
                return 
            }
            this.$router.push({
                path: "/user/mymessage/private",
                query: {
                    user: JSON.stringify(this.userInfo)
                }
            })
        }
    },
    created() {
        this.uid = this.$router.history.current.query._id
        this.getInfo(this.uid)
        this.getUserText(this.uid)
    },
    computed: {
        ...mapState([
            'user',
            'focusArr'
        ])
    }
}
</script>

<style lang='less' scoped>
.el-container{
    .el-main{
        .el-row{
            .el-col:nth-child(1){
                .userBox{
                    margin: 10px 0;
                    img{
                        width: 200px;
                        height: 200px;
                        display: inline-block;
                        vertical-align: middle;
                        border: 2px solid #ccc;
                    }
                    h3{
                        border-left: 5px solid #3cabcf;
                        padding: 10px;
                    }
                    p{
                        display: flex;
                        margin: 10px 0;
                        padding: 0 10px;
                        text-align: left;
                        span{
                            flex: 1;
                        }
                    }
                    .userTro{
                        margin: 20px 0;
                    }
                    .pubBox{
                        margin: 20px 0;
                        box-shadow: 0 0 4px #ccc;
                        ul{
                            padding: 10px;
                            li{
                                font-size: 16px;
                                padding: 5px 15px;
                                line-height: 2;
                                cursor: pointer;
                                color: #463b3b;
                            }
                            li:hover{
                                box-shadow: 0 0 4px #ccc;
                                color: #000;
                            }
                        }
                    }
                }
                .userBox:last-child{
                    padding-right: 20px;
                }
            }
            .el-col:nth-child(2){
                .box-card{
                    margin-bottom: 20px;
                    .item{
                        margin-bottom: 10px;
                        cursor: pointer;
                        h4{
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            word-break: break-all;
                            color: #464242;
                        }
                        h4:hover{
                            color: #000;
                        }
                    }
                }
            }
        }
    }
}
</style>