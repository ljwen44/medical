<template>
    <div class="cardWrapper">
        <div class="cardHeader">
            <el-avatar :size="60" :src="item.user[0].avatar" @error="errorHandler">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
            </el-avatar>
            <p class="autor">
                <router-link :to="'/userDetail?_id='+item.user[0]._id" tag="span">{{item.user[0].userName}}</router-link>
                <br>
                <span class="fans">粉丝：{{item.user[0].fans}}</span>
            </p>
            <el-button type="primary" @click="handleClick(focusArr.includes(item.user[0]._id))">{{focusArr.includes(item.user[0]._id) ? "取消关注" : "关注"}}</el-button>
        </div>
        <div class="cardContent">
            {{item.user[0].introduce}}
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {

        }
    },
    methods: {
        errorHandler(){
            return true
        },
        handleClick(flag){
            // flag为真，则表示是取消关注， 为假则为关注
            if(flag){
                this.axios.post("/cancelFocusUser", {
                    uid: this.user._id,
                    cuid: this.item.user[0]._id
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.user.focus--
                        this.$store.commit('SETUSER', this.user)
                        this.$store.commit('DELFOCUS', this.item.user[0]._id)
                    } else {
                        this.$message("操作失败，请稍后重试！")
                    }
                }).catch(err => {
                    this.$message("操作失败，请稍后重试！")
                })
            } else {
                this.axios.post("/focusUser", {
                    uid: this.user._id,
                    cuid: this.item.user[0]._id
                }).then(res => {
                    if(res.data.message === "OK"){
                        this.user.focus++
                        this.$store.commit('SETUSER', this.user)
                        this.$store.commit('ADDFOCUS', this.item.user[0]._id)
                    } else {
                        this.$message("操作失败，请稍后重试！")
                    }
                }).catch(err => {
                    this.$message("操作失败，请稍后重试！")
                })
            }
        }
    },
    props: {
        item: Object
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
.cardWrapper{
    border-bottom: 1px solid #ccc;
    padding: 10px;
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
}
</style>