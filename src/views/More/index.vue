<template>
    <el-container class="moreWrapper">
        <el-main>
            <el-row>
                <el-col :xs="24" :sm="16" :md="18" class="moreShow">
                    <h3 style="margin: 20px 0;">{{type==='notice'?"公告列表":"文章列表"}}</h3>
                    <ul>
                        <li v-for="(item, index) in list" :key="index">
                            <router-link tag="h4" :to="'/detail?_id='+item._id+'&uid='+item.uid" v-if="type!=='notice'">{{item.title}}</router-link>
                            <router-link tag="h4" :to="'/notice?_id='+item._id" v-else>{{item.title}}</router-link>
                        </li>
                    </ul>
                    <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="total"
                    @current-change="currentPageChange">
                    </el-pagination>
                </el-col>
                <el-col :sm="8" :md="6" class="moreRecommended">
                    <div class="titleWrapper">
                        <h3 style="margin-bottom: 10px;">用户推荐</h3>
                    </div>
                    <div class="recommended_content">
                        <UserCard :list="reUserList"></UserCard>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import UserCard from '_c/UserCard/index'
export default {
    data() {
        return {
            list: [],
            type: '',
            page: 1,
            reUserList: [],
            total: 0
        }
    },
    methods: {
        getData(){
            if(this.type !== "notice"){
                this.axios.post("/getMoreByType", {
                    type: this.type,
                    page: this.page
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.list = res.data.text
                        this.total = res.data.total
                    } else {
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    }
                }).catch(err => {
                    this.$alert("数据获取异常，请稍后重试！", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            } else {
                this.axios.post("/getNotice", {
                    type: this.type,
                    page: this.page
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.list = res.data.notices
                        this.total = res.data.total
                    } else {
                        this.$alert(res.data.message, "提示", {
                            confirmButtonText: "确定"
                        })
                    }
                }).catch(err => {
                    this.$alert("数据获取异常，请稍后重试！", "提示", {
                        confirmButtonText: "确定"
                    })
                })
            }
        },
        getUser(){
            this.axios.get("/getUserByRecommened")
            .then(res => {
                if(res.data.message === "OK"){
                    this.reUserList = res.data.users
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
        currentPageChange(page){
            this.page = page
            this.getData()
        },
    },
    created() {
        this.type = this.$router.history.current.query.type
        this.getData()
        this.getUser()
    },
    components: {
        UserCard
    }
}
</script>

<style lang='less' scoped>
h4{
    margin: 0;
}
.moreWrapper{
    .el-main{
        .moreShow{
            padding: 0 10px 10px 10px;
            box-shadow: 0 0 4px #ccc;
            ul{ 
                li{
                    padding: 10px 0;
                    cursor: pointer;
                }
                li:hover{
                    box-shadow: 0 0 4px #ccc;
                }
                li:nth-child(1){
                    color: blue;
                    font-size: 20px;
                }
                li:nth-child(2){
                    color: blue;
                    font-size: 20px;
                }
                li:nth-child(3){
                    color: blue;
                    font-size: 20px;
                }
            }
            .el-pagination{
                text-align: center;
                margin-top: 20px;
            }
        }
        .moreRecommended{
            .titleWrapper{
                padding: 0 20px;
                display: flex;
                justify-content: space-around;
                h3{
                    display: inline-block;
                    flex: 1;
                }
                .el-button{
                    padding: 0;
                    background: none;
                    font-size: 12px;
                    border: none;
                }
                .el-button:hover{
                    background: none;
                }
            }
            .recommended_content{
                padding: 0 20px;
                box-shadow: 0 0 4px #ccc;
                margin: 0 20px;
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
                            }
                            i{
                                font-size: 12px;
                            }
                        }
                        .avater_bottom{
                            p{
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
        }
    }
}
@media screen and(max-width: 768px){
    .moreRecommended{
        display: none;
    }
}
@media screen and(max-width: 414px){
    .el-pagination{
        display: none;
    }
}
</style>