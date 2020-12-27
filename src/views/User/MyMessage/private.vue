<template>
    <el-main>
        <el-row v-show="chatList.length > 0">
            <el-col :sm="10" :md="8" class="userList">
                <el-input
                    placeholder="请输入内容"
                    prefix-icon="el-icon-search"
                    v-model="searchVal">
                </el-input>
                <ul>
                    <li v-for="(item, index) in chatList.filter(data => !searchVal || data.user.userName.toLowerCase().includes(searchVal.toLowerCase()))" 
                        :key="index" 
                        @click="handleClick(index, item.user)"
                        @contextmenu.prevent="show(index)"
                        :class="index === bgIndex ? 'active' : ''">
                        <el-badge :value="item.readNum === 0 ? '': item.readNum">
                            <el-avatar shape="square" :size="40" :src="item.user.avatar"></el-avatar>
                        </el-badge>
                        <p class="userName">{{item.user.userName}}<span>{{item.time | timeFilter('chat')}}</span></p>
                        <p class="content"
                            v-html="item.desc.includes('data:image/')?'[图片]':item.desc"></p>
                        <span 
                            class="tip" 
                            :style="{left: pos.left + 'px',top: pos.top + 'px'}"
                            @mouseleave="showDel = false"
                            v-if="showDel"
                            @click="del()">删除</span>
                    </li>
                </ul>
            </el-col>
            <el-col :sm="14" :md="16" class="chatWrapper">
                <Chat :recuser="recuser"></Chat>
            </el-col>
        </el-row>
        <el-row v-show="chatList.length <= 0" class="zero">
            <h3>暂时还没有人私聊你哦~</h3>
        </el-row>
    </el-main>
</template>

<script>
import Chat from '_c/Chat/index.vue'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            bgIndex: 0,
            searchVal: '',
            pos: {
                left: 0,
                top: 0
            },
            showDel: false,
            delIndex: 0,
            recuser: {}
        }
    },
    components: {
        Chat
    },
    methods: {
        getData(){
            this.axios.post("/getReadChatByID", {
                uid: this.user._id
            }).then(res => {
                console.log(res.data)
                if(res.data.message === "OK"){
                    this.$store.commit("NEWCHAT", res.data.data)
                } else {
                    this.$message(res.data.message)
                }
            }).catch(err => {
                this.$message("获取数据异常，请稍后重试！")
            })
        },
        show(index, event){
            this.delIndex = index
            this.showDel = true
            var e = event || window.event;
            this.pos.left = e.clientX
            this.pos.top = e.clientY
        },
        del(){
            this.$store.commit('DELCHAT', this.delIndex)
        },
        handleClick(index, item){
            this.bgIndex = index
            this.recuser = item
        }
    },
    mounted() {
        let userQuery = this.$router.history.current.query.user
        let flag = false
        if(userQuery !== undefined){
            let newuser = JSON.parse(userQuery)
            this.recuser = newuser
            for(let i=0; i < this.chatList.length; i++){
                if(this.chatList[i].user._id === newuser._id){
                    let temp = {
                        user: newuser,
                        desc: this.chatList[i].desc,
                        time: this.chatList[i].time
                    }
                    this.chatList.splice(i, 1)
                    this.chatList.unshift(temp)
                    flag = true
                    break
                }
            }
            if(!flag){
                let obj = {
                    user: newuser,
                    desc: '',
                    time: ''
                }
                this.$store.commit('ADDCHAT', obj)
            }
        } else {
            this.recuser = this.chatList.length ? this.chatList[0].user : {}
        }
    },
    created() {
        this.getData()
    },
    computed: {
        ...mapState([
            'user',
            'chatList'
        ]),
    },
    watch: {
        chatList(newVal, oldVal){
            if(this.recuser.userName === undefined){
                this.recuser = newVal[0]
            }
            return newVal
        }
    }
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    overflow: hidden;
    min-height: 400px;
    .el-row{
        .userList{
            background: rgba(255,255,255,.5);
            padding: 10px;
            ul{
                height: 498px;
                margin-top:10px;
                overflow: auto;
                border: 1px solid #ccc;
                position: relative;
                li{
                    padding: 10px;
                    border-bottom: 1px solid #ccc;
                    height: 40px;
                    cursor: pointer;
                    .el-badge{
                        float: left;
                    }
                    p{
                        text-align: left;
                        line-height: 22px;
                        margin-left: 60px;
                    }
                    .userName{
                        font-size: 12px;
                        span{
                            float: right;
                            color: #827676;
                        }
                    }
                    .content{
                        color: #827676;
                        font-size: 12px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .tip{
                        background: #ccc;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 5px 10px;
                        font-size: 12px;
                        cursor: default;
                        position: fixed;
                        z-index: 111;
                    }
                    .tip:hover{
                        background: #fff;
                    }
                }
                li:hover{
                    background: rgba(138, 179, 225, 0.2);
                }
                .active{
                    background: rgba(138, 179, 225, 0.6);
                }
                
            }
            
        }
        .chatWrapper{
            background: #e9f1f9;
            height: 570px;
        }
    }
    .zero{
        h3{
            margin: 20px;
            text-align: left;
        }
    }
}
ul::-webkit-scrollbar{ 
    width:1px;
}
ul::-webkit-scrollbar-track{
    background: #ccc;
    border-radius:2px;
    -webkit-border-radius:2px;
    -moz-border-radius:2px;
    -ms-border-radius:2px;
    -o-border-radius:2px;
}
ul::-webkit-scrollbar-thumb{
    background: #80a8d9;
    border-radius:10px;
    -webkit-border-radius:10px;
    -moz-border-radius:10px;
    -ms-border-radius:10px;
    -o-border-radius:10px;
}
ul::-webkit-scrollbar-thumb:hover{
    background: #333;
}
ul::-webkit-scrollbar-corner{
    background: #179a16;
}
</style>