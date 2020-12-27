<template>
    <el-main>
        <el-row>
            <el-col :sm="18" :md="18">
                <div class="box">
                    <h3>基本资料</h3>
                    <p>
                        <span>昵称：{{user.userName}}</span>
                        <span>性别：{{user.sex}}</span>
                    </p>
                    <p>
                        <span>出生年月： {{user.bir === '' ? '-' : user.bir | timeFilter('yyyy-MM-dd')}}</span>
                    </p>
                    <p>
                        <span>手机号码： {{user.phone}}</span>
                        <span>邮箱：{{user.email}}</span>
                    </p>
                    <p v-if="user.type === '医生'">
                        <span>工作单位：{{user.work}}</span>
                        <span>科目：{{user.job}}</span>
                    </p>
                    <p>
                        简介：{{user.introduce}}
                    </p>
                    <p>
                        证件：
                        <img :src="user.IDpass" alt="" preview="1" width="150">
                    </p>
                    <router-link to="/user/edit">
                        <el-button type="primary" style="margin-left: 10px; margin-top:10px;">编辑资料</el-button>
                    </router-link>
                    <el-button 
                        :type="user.auth === 0? 'success':'info'" 
                        :disabled="user.auth === 0? false : true"
                        v-if="user.type==='医生'"
                        style="margin-left: 10px; margin-top:10px;"
                        @click="handleAuth">
                        {{user.auth === 0? "申请认证": "已认证"}}
                    </el-button>
                </div>
                <div class="box">
                    <h3>最近访问</h3>
                    <el-timeline>
                        <el-timeline-item 
                            v-for="(item, index) in lastestVisited"
                            :key="index"
                            placement="top">
                            <div class="cardHeader">
                                <el-avatar :size="60" :src="item.avatar" @error="errorHandler">
                                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                                </el-avatar>
                                <p class="autor">
                                    <router-link :to="'/userDetail?_id='+item._id" tag="span">{{item.userName}}</router-link>
                                    <br>
                                    <span class="fans">粉丝：{{item.fans}}</span>
                                </p>
                                <el-button type="primary">{{focusArr.includes(item._id) ? "取消关注" : "关注"}}</el-button>
                            </div>
                            <div class="cardContent">
                                {{item.introduce}}
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </div>
                <div class="box">
                    <h3>最近查看</h3>
                    <el-timeline>
                        <el-timeline-item 
                            v-for="(item, index) in lastestWatch"
                            :key="index"
                            :timestamp="item.time | timeFilter('yyyy-MM-dd')" placement="top">
                            <el-card>
                                <router-link tag="h4" :to="'/detail?_id='+item._id +'&uid='+item.uid">{{item.title}}</router-link>
                                <p>
                                    发布于 {{item.time | timeFilter('yyyy-MM-dd hh:mm:ss')}}
                                    <span style="text-align: right;">回复: {{item.reply | numFilter}}</span>
                                </p>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-col>
            <el-col :sm="6" :md="6">
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
        }
    },
    created() {
        this.user.bir ? '' : this.user.bir = ''
    },
    computed: {
        ...mapState([
            'user',
            'focusArr',
            'lastestVisited',
            'lastestWatch'
        ])
    },
    methods: {
        handleAuth(){
            if(this.user.authStatus === 1){
                this.$alert("您已申请认证，请等待管理员处理", "提示", {
                    confirmButtonText: "确定"
                })
            } else {
                this.axios.post("/updAuthStatus", {
                    _id: this.user._id,
                    authStatus: 1
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.$alert("申请成功！等待管理员处理", "提示", {
                            confirmButtonText: "确定",
                            callback: () => {
                                this.$store.commit('SETUSER', res.data.user)
                            }
                        })
                    } else {
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    }
                }).catch(err => {
                    this.$alert("申请失败，请稍后重试！", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }
        },
        errorHandler(){
            return true
        }
    },
}
</script>

<style lang='less' scoped>
.is-selected {
    color: #1989FA;
}
.el-main{
    .el-row{
        .el-col{
            .box{
                padding: 0 10px;
                text-align: left;
                margin-bottom: 20px;
                h3{
                   border-left: 5px solid #3cabcf;
                   padding-left: 10px;
                }
                p{
                    margin: 5px 0;
                    padding: 10px;
                    display: flex;
                    span{
                        flex: 1;
                    }
                }
                ul{
                    padding: 10px 0;
                }
                .el-timeline{
                    text-align: left;
                    .el-timeline-item{
                        .cardHeader{
                            text-align: left;
                            .el-avatar{
                                vertical-align: middle;
                                margin-right: 20px;
                            }
                            .autor{
                                margin-right: 20px;
                                font-weight: 600;
                                vertical-align: middle;
                                display: inline-block;
                                span{
                                    cursor: pointer;
                                }
                                .fans{
                                    font-weight: 400;
                                    font-size: 12px;
                                    color: #423f3f;
                                }
                            }
                            .el-button{
                                margin-top: 10px;
                                float: right;
                                padding: 5px 10px;
                            }
                        }
                        .cardContent{
                            margin-top: 20px;
                            text-align: left;
                            font-size: 14px;
                            color: #312c2c;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                        }
                        .el-timeline-item__wrapper{
                            .el-card{
                                background-color: rgba(255,255,255,.5);
                                h4{
                                    cursor: pointer;
                                }
                                p{
                                    font-size: 12px;
                                }
                            }
                            .el-card:hover{
                                border: 1px solid #3cabcf;
                                background-color: rgba(255,255,255,1);
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>