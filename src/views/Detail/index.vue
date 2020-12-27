<template>
    <el-container>
        <el-main>
            <el-row>
                <el-col :xs="24" :sm="24" :md="18" :lg="18" class="detail_wrapper">
                    <div class="content_header">
                        <el-avatar :size="50" :src="author.avatar" @error="errorHandler" class="avater">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                        </el-avatar>
                        <router-link :to="'/userDetail?_id='+author._id" tag="span" class="userName">{{author.userName}}</router-link>
                        <el-tag type="info" class="flag" v-if="author.type === '医生'">
                            <i class="iconfont icon-renzheng" :style="{color: author.auth ? 'green': 'grey'}">
                                {{author.auth ? '已认证': '未认证'}}
                            </i>
                        </el-tag>
                        <el-button 
                            type="primary" 
                            style="margin: 10px 10px;"
                            size="mini"
                            @click="handleChat"
                            v-if="author._id !== user._id"
                        >私聊</el-button>
                    </div>
                    <div class="content_main" v-if="!text">
                        <h3>原文已被作者删除!</h3>
                    </div>
                    <div class="content_main" v-if="text">
                        <h3>{{text.title}}</h3>
                        <p>{{text.desc}}</p>
                    </div>
                    <div class="content_footer" v-if="text">
                        <i class="el-icon-time">{{text.time | timeFilter('yyyy-MM-dd hh:mm:ss')}}</i>
                        <i class="iconfont icon-dianzan icon" 
                            :style="{color: likeArr.includes(text._id) ? 'red' : '#ccc'}"
                            @click="dianzan(text._id)">{{text.like | numFilter}}</i>
                    </div>
                </el-col>
                <el-col :sm="6" :md="6" :lg="6" class="detail_recommend">
                </el-col>
            </el-row>
            <!-- 发表评论 -->
            <el-row style="margin-top: 10px;" v-if="text">
                <el-col :xs="24" :sm="24" :md="18" :lg="18" class="el-text">
                    <textarea
                    class="textarea"
                    placeholder="请输入内容"
                    v-model="comment">
                    </textarea>
                    <el-button type="primary" @click="handleComment" class="cbtn">评论</el-button>
                </el-col>
            </el-row>
            <!-- 评论列表 -->
            <el-row style="padding: 10px 0;" v-if="text">
                <el-col :xs="24" :sm="24" :md="18" :lg="18" class="el-comment">
                    <span>评论：{{total}}</span>
                    <el-divider></el-divider>
                    <div v-if="commentList.length">
                        <ul>
                            <li v-for="(item, index) in commentList" :key="index">
                                <Comment :item="item"></Comment>
                            </li>
                        </ul>
                        <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="commentList.length"
                        @current-change="currentPageChange">
                        </el-pagination>
                    </div>
                    <p v-else>
                        当前还没有人评论哦~写下第一条评论吧~
                    </p>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import {mapState} from 'vuex'
import Comment from '_c/Comment/index.vue'
export default {
    data() {
        return {
            comment: '',
            text: {},
            author: {},
            tid: '',
            uid: '',
            commentList: [],
            total: 0,
            page: 1,
        }
    },
    methods: {
        getData(_id, uid){
            this.axios.post("/getTextByID", {
                _id,
                uid
            })
            .then(res => {
                if(res.data.message === "OK"){
                    this.text = res.data.text
                    this.author = res.data.user
                    if(this.user._id){
                        if(res.data.text){
                            this.$store.commit('ADDNEWWATCH', this.text)
                        } else {
                            this.$store.commit('DELWATCH', this.tid)
                        }
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
        getCommentListData(tid){
            this.axios.post("/getCommentByID", {
                tid,
                page: this.page
            })
            .then(res => {
                if(res.data.message === "OK"){
                    this.commentList = res.data.commentList
                    this.total = res.data.total
                } else {
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("获取数据失败，请稍后重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        errorHandler(){
            return true
        },
        handleComment(){
            if(!this.user._id){
                this.$alert("登录后即可评论", "提示", {
                    confirmButtonText: "确定"
                })
                return 
            }
            let data = {
                tid: this.tid,
                uid: this.user._id,
                desc: this.comment
            }
            this.axios.post("/addComment", data)
            .then(res => {
                if(res.data.message === "OK"){
                    this.comment = ''
                    this.page = 1
                    this.$message({
                        type: "success",
                        message: "评论成功" 
                    })
                    this.getCommentListData(this.tid)
                } else {
                    this.$alert(res.data.message, "提示", {
                        confirmButtonText: "确定"
                    })
                }
            }).catch(err => {
                this.$alert("评论失败，请稍后重试！", "提示", {
                    confirmButtonText: "确定"
                })
            })
        },
        currentPageChange(page){
            this.page = page
            this.getCommentListData(this.tid)
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
                        this.text.like++
                    } else {
                        this.$message("点赞失败!")
                    }
                }).catch(err => {
                    this.$message("点赞失败!")
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
                    user: JSON.stringify(this.author)
                }
            })
        }
    },
    components: {
        Comment
    },
    created() {
        this.tid = this.$router.history.current.query._id
        this.uid = this.$router.history.current.query.uid
        this.getData(this.tid, this.uid)
        this.getCommentListData(this.tid)
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
.detail_wrapper{
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    padding: 10px;
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
            font-size: 16px;
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
        padding: 10px 0;
        h3{
            margin: 5px 0;
        }
        p{
            margin: 15px 0;
            text-indent: 20px;
        }
    }
    .content_footer{
        font-size: 14px;
        color: #ccc;
        .icon{
            float: right;
            cursor: pointer;
        }
    }
}
.detail_recommend{
    padding: 0 10px;
    .text {
        font-size: 14px;
    }
    .item {
        margin-bottom: 18px;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
}
.el-text{
    position: relative;
    display: inline-block;
    vertical-align: bottom;
    font-size: 14px;
    .textarea{
        display: block;
        resize: none;
        padding: 5px 15px;
        height: 150px;
        line-height: 1.5;
        box-sizing: border-box;
        width: 100%;
        font-size: inherit;
        color: #606266;
        background-color: #FFF;
        background-image: none;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
    .textarea:focus {
        outline: 0;
        border-color: #409EFF;
    }
    .cbtn{
        margin-top: 10px;
    }
}
.el-comment{
    ul {
        li {
            padding: 10px;
            box-shadow: 0 0 4px #ccc;
            border-radius: 4px;
            margin-bottom: 5px;
        }
    }
    .el-pagination{
        text-align: center;
        margin-top: 30px;
    }
}
@media screen and (max-width: 768px){
    .detail_recommend{
        display: none;
    }
    .el-pagination{
        display: none;
    }
}
</style>