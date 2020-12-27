<template>
    <el-container>
        <el-main class="elMain_index elContainer_index_main">
            <el-main class="elMain_nav_wrapper">
                <div class="block">
                    <el-carousel trigger="click" height="300px">
                        <el-carousel-item v-for="(item, index) in imglist.slice(0,4)" :key="index">
                            <img :src="item.img" :alt="item.desc" :title="item.title" class="bannerImg">
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </el-main>
            <el-main class="elMain_main_recommended">
                <el-row>
                    <el-col :md="6">
                        <div class="elMain_main_recommended_title">
                            <i class="iconfont icon-remen">热门</i>
                            <router-link to="/more?type=hot" tag="a" class="el-link el-link--default is-underline">更多&gt;&gt;</router-link>
                        </div>
                        <div class="elMain_main_recommended_text">
                            <ul>
                                <li v-for="(item, index) in hot" :key="index">
                                    <router-link :to="'/detail?_id='+item._id+'&uid='+item.uid" tag="span">{{item.title}}</router-link>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :md="6">
                        <div class="elMain_main_recommended_title">
                            <i class="iconfont icon-tuijian1">推荐</i>
                            <router-link to="/more?type=recommend" tag="a" class="el-link el-link--default is-underline">更多&gt;&gt;</router-link>
                        </div>
                        <div class="elMain_main_recommended_text">
                            <ul>
                                <li v-for="(item, index) in recommend" :key="index">
                                    <router-link :to="'/detail?_id='+item._id+'&uid='+item.uid" tag="span">{{item.title}}</router-link>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :md="6">
                        <div class="elMain_main_recommended_title">
                            <i class="iconfont icon-zixun">资讯</i>
                            <router-link to="/more?type=information" tag="a" class="el-link el-link--default is-underline">更多&gt;&gt;</router-link>
                        </div>
                        <div class="elMain_main_recommended_text">
                            <ul>
                                <li v-for="(item, index) in information" :key="index">
                                    <router-link :to="'/detail?_id='+item._id+'&uid='+item.uid" tag="span">{{item.title}}</router-link>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :md="6">
                        <div class="elMain_main_recommended_title">
                            <i class="iconfont icon-gonggao">公告</i>
                            <router-link to="/more?type=notice" tag="a" class="el-link el-link--default is-underline">更多&gt;&gt;</router-link>
                        </div>
                        <div class="elMain_main_recommended_text">
                            <ul>
                                <li v-for="(item, index) in notice" :key="index">
                                    <router-link :to="'/notice?_id='+item._id" tag="span">{{item.title}}</router-link>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
            <el-main class="elMain_main_wrapper">
                <el-main class="elMain_main_left">
                    <el-row style="line-height: 40px; padding-bottom: 5px;">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="elMain_main_left_nav">
                            <el-tabs v-model="tabType" @tab-click="handleClick">
                                <el-tab-pane label="咨询" name="consult">
                                    <ul>
                                        <li v-for="(item, index) in list.filter(data => data.user[0].type === '普通用户')" :key="index">
                                            <Article :item="item"></Article>
                                        </li>
                                    </ul>
                                </el-tab-pane>
                                <el-tab-pane label="最新" name="lastest">
                                    <ul>
                                        <li v-for="(item, index) in list" :key="index">
                                            <Article :item="item"></Article>
                                        </li>
                                    </ul>
                                </el-tab-pane>
                                <el-tab-pane label="热门" name="hot">
                                    <ul>
                                        <li v-for="(item, index) in list" :key="index">
                                            <Article :item="item"></Article>
                                        </li>
                                    </ul>
                                </el-tab-pane>
                                <el-tab-pane label="关注" name="focus" v-if="user._id">
                                    <ul>
                                        <li 
                                            v-for="(item, index) in list.filter(data => focusArr.includes(data.user[0]._id))" 
                                            :key="index">
                                            <Article :item="item"></Article>
                                        </li>
                                    </ul>
                                </el-tab-pane>
                                <p @click="moreFlag && loadMore()">
                                    {{ moreFlag ? "点击加载更多" : "没有更多数据了哦" }}
                                </p>
                            </el-tabs>
                            
                        </el-col>
                    </el-row>
                </el-main>
                <el-main class="elMain_main_right">
                    <div class="elMain_main_right_wrapper">
                        <div class="elMain_main_right_title">
                            <span>推荐</span>
                        </div>
                        <div class="elMain_main_right_content">
                            <UserCard :list="reUserList"></UserCard>
                        </div>
                    </div>
                </el-main>
            </el-main>
        </el-main>
    </el-container>
</template>

<script>
import Article from '_c/Article/index.vue'
import UserCard from '_c/UserCard/index'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            reUserList: [],
            imglist: [],
            list: [],
            tabType: 'consult',
            tabPage: 1,
            moreFlag: true,
            hot: [],
            recommend: [],
            information: [],
            notice: []
        }
    },
    components: {
        Article,
        UserCard
    },
    methods: {
        getBannerData(){
            this.axios.get("/getAllBanner")
            .then(res => {
                if(res.data.message === "OK"){
                    this.imglist = res.data.banners
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
        getNavData(){
            this.axios.get("/getNavData")
            .then(res => {
               if(res.data.message === "OK"){
                    this.hot = res.data.hot
                    this.recommend = res.data.recommend
                    this.information = res.data.information
                    this.notice = res.data.notice
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
        getRecommenedData(){
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
        getTabData(type){
            this.axios.post("/getTextByType", {
                type,
                _id: this.user._id,
                page: this.tabPage
            }).then(res => {
                if(res.data.message === "OK"){
                    this.list = res.data.list
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
        handleClick(tab) {
            this.tabType = tab.name
            this.tabPage = 1
            this.moreFlag = true
            this.getTabData(this.tabType) 
        },
        errorHandler(){
            return true
        },
        loadMore(){
            this.tabPage++
            this.axios.post("/getTextByType", {
                type: this.tabType,
                _id: this.user._id,
                page: this.tabPage
            }).then(res => {
                if(res.data.message === "OK"){
                    if(res.data.list.length < 5){
                        this.moreFlag = false
                    }
                    this.list = this.list.concat(res.data.list)
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
        }
    },
    created() {
        this.getBannerData()
        this.getNavData()
        this.getRecommenedData()
        this.getTabData(this.tabType)
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
.elContainer_index_main{
    background: #fff;
    .elMain_nav_wrapper{
        .elNav_item{
            font-size: 14px;
            color: #3e3939;
            margin-bottom: 1%;
            line-height: 1.5;
        }
        .elNav_item div:first-child{
            text-align: center;
        }
        .elNav_item div a{
            margin-right: 10px;
        }
        .el-carousel__item img {
            width: 100%;
            height: 100%;
        }

        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }
        
        .el-carousel__item:nth-child(2n+1) {
            background-color: #d3dce6;
        }
    }
    .elMain_main_recommended{
        padding: 10px;
        .el-col{
            padding: 20px;
            transition: all ease .5s;
            .elMain_main_recommended_title{
                display: flex;
                border-bottom: 1px solid #ccc;
                justify-content: space-between;
                .iconfont{
                    flex: 3;
                    text-align: left;
                    color: #3cabcf;
                    font-size: 14px;
                }
                .el-link{
                    flex: 1;
                    font-size: 12px;
                }
            }
            .elMain_main_recommended_text{
                ul{
                    margin: 0;
                    padding: 0;
                    li{
                        list-style: none;
                        padding: 5px 0;
                        color: #4c4a4a;
                        font-size: 14px;
                        span{
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            display: block;
                            cursor: pointer;
                        }
                        span:hover{
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
        .el-col:hover{
            box-shadow: 0 0 4px #ccc;
        }
    }
    .elMain_main_wrapper{
        display: flex;
        padding: 20px;
        .elMain_main_left{
            flex: 4;
            padding: 0;
            padding-bottom: 10px;
            .elMain_main_left_nav{
                display: flex;
                span{
                    margin-right: 10px;
                    font-size: 18px;
                    cursor: pointer;
                }
                .el-tabs{
                    width: 100%;
                    .is-top{
                        padding-left: 10px;
                    }
                    p{
                        text-align: center;
                        margin: 20px 0;
                        color: #5f5f5f;
                        cursor: pointer;
                    }
                }
            }
            ul{
                padding: 0;
                margin: 10px;
                li{
                    list-style: none;
                    padding-bottom: 5px;
                    box-shadow: 0 0 4px #ccc;
                    padding: 10px;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                li:hover{
                    box-shadow: 0 0 8px #3cabcf;
                }
            }
            
        }
        .elMain_main_right{
            flex: 1;
            padding: 10px;
            .elMain_main_right_wrapper{
                .elMain_main_right_title{
                    display: flex;
                    padding: 5px;
                    border-bottom: 1px solid #ddd;
                    span{
                        flex: 1;
                        font-size: 14px;
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
            }
        }
    }
}
.el-main{
    padding: 0;
}
@media screen and (max-width: 768px){
    .elContainer_index_main{
        .elMain_main_wrapper{
            margin-top: 0;
            .elMain_main_left{
                .elMain_main_left_nav{
                    .split{
                        display: none;
                    }
                    span{
                        flex: 1;
                        display: inline-block;
                        text-align: center;
                    }
                    span:first-child{
                        border-right: 1px solid #ccc;
                    }
                }
                .elMain_main_left_search{
                    display: none;
                }
                .elMain_main_left_content{
                    ul{
                        li{
                            .content_main{
                                p{
                                    word-break: break-all;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                }
                            }
                            
                        }
                    }
                }
            }
            .elMain_main_right{
                display: none;
            }
        }
    }
}
@media screen and (min-width: 769px) and (max-width: 992px){
    .recommened_li{
        .el-avatar{
            width: 40px;
            height: 40px;
            line-height: 30px;
        }
        .avater_wrapper{
            width: 45%;
        }
    }
}
</style>