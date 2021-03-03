<template>
    <el-main>
        <el-row style="overflow: hidden;">
            <el-col :sm="12" :md="12" :lg="12">
                <pie :title="'用户类型'" :flag="true"></pie>
            </el-col>
            <el-col :sm="12" :md="12" :lg="12">
                <pie :title="'文章比例'" :flag="false"></pie>
            </el-col>
        </el-row>
        <el-row style="overflow: hidden;">
            <h3>文章发表量</h3>
            <div style="text-align: left;margin: 10px 0;">
                <el-cascader
                    v-model="selectVal"
                    :options="options">
                </el-cascader>
                <bar :time="selectVal"></bar>
            </div>
        </el-row>
        <h3>文章排名</h3>
        <el-button @click="getDataByLike">点赞排名</el-button>   
        <el-button @click="getDataByRead">阅读量排名</el-button>   
        <el-row>
            <el-table
                v-loading="loading"
                :data="tableData"
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="文章详情:">
                                <span>{{ props.row.desc }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="发布者">
                    <template slot-scope="scope">
                        {{ scope.row.user[0].userName }}
                    </template>
                </el-table-column>
                <el-table-column label="文章标题">
                    <template slot-scope="scope">
                        {{ scope.row.title }}
                    </template>
                </el-table-column>
                <el-table-column label="阅读量">
                    <template slot-scope="scope">
                        {{ scope.row.read }}
                    </template>
                </el-table-column>
                <el-table-column label="点赞数">
                    <template slot-scope="scope">
                        {{ scope.row.like }}
                    </template>
                </el-table-column>
                <el-table-column label="发布时间">
                    <template slot-scope="scope">
                        {{ scope.row.time | timeFilter("yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </el-main>
</template>

<script>
import pie from '_c/Echarts/pie.vue'
import bar from '_c/Echarts/bar.vue'
import { months } from '@/lib/data.js'
export default {
    data() {
        return {
            loading: false,
            tableData: [],
            options: months,
            selectVal: []
        }
    },
    components: {
        pie,
        bar
    },
    created() {
        let time = new Date()
        this.selectVal.push(time.getFullYear())
        this.selectVal.push(time.getMonth()+1)
    },
    mounted() {
        this.getDataByLike()
    },
    methods: {
        getDataByLike() {
            this.loading = true
            this.axios.get('/getTextByLike')
            .then(res => {
                this.tableData = res.data.data
                this.loading = false
            }).catch(err => {
                console.log(err)
            })
        },
        getDataByRead() {
            this.loading = true
            this.axios.get('/getTextByRead')
            .then(res => {
                this.tableData = res.data.data
                this.loading = false
            }).catch(err => {
                console.log(err)
            })
        }
    },
}
</script>

<style lang='less' scoped>
.el-main{
    padding: 0;
    h3 {
        border-left: 5px solid #55accf;
        padding-left: 15px;
        margin-bottom: 10px;
        color: #55accf;
    }
}
</style>