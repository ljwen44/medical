<template>
    <div class="echarts">
        <div :style="{height:'400px',width:'100%'}" ref="lineEchart"></div>
    </div>
</template>

<script>
export default {
    name: "lineEcharts",
    props: {
        time: Array,
    },
    data() {
        return {
            chart: null,
            docArr: [],
            userArr: [],
            day: [],
        };
    },
    mounted() {
        this.chinaConfigure()
        this.getData(this.time[0])
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
    methods: {
        chinaConfigure() {
            this.chart = this.$echarts.init(this.$refs.lineEchart); //这里是为了获得容器所在位置
            this.chart.setOption({
                title: {
                    text: '每月文章发表数',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#3cabcf'
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['医生', '普通用户']
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: this.day
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '医生',
                        type: 'bar',
                        data: [],
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        itemStyle: {
                            normal: {
                                color: '#7bd4f1'
                            }
                        }
                    },
                    {
                        name: '普通用户',
                        type: 'bar',
                        data: [],
                        markPoint: {
                            data: [
                                {name: '最大值', type: 'max'},
                                {name: '最小值', type: 'min'}
                            ]
                        },
                        itemStyle: {
                            normal: {
                                color: '#2a97bb'
                            }
                        }
                    }
                ]
            })
            window.addEventListener('resize', () => {
                this.chart.resize()
            })
        },
        getDay(time){
            this.day.length = 0
            let year = time[0], month = time[1]
            switch(month){
                case 2:
                    month = "0" + month
                    if(year % 100 != 0 && year % 4 == 0 || year % 400 == 0){
                        for(let i=1; i < 30; i++){
                            let date = i < 10 ? '0'+ i : i
                            let str = month + "-" + date
                            this.day.push(str)
                        }
                    } else {
                        for(let i=1; i < 29; i++){
                            let date = i < 10 ? '0'+ i : i
                            let str = month + "-" + date
                            this.day.push(str)
                        }
                    }
                    break
                case 4 || 6 || 9 || 11:
                    if(month < 10){
                        month = "0" + month
                    }
                    for(let i=1; i < 31; i++){
                        let date = i < 10 ? '0'+ i : i
                        let str = month + "-" + date
                        this.day.push(str)
                    }
                    break
                default:
                    if(month < 10){
                        month = "0" + month
                    }
                    for(let i=1; i < 32; i++){
                        let date = i < 10 ? '0'+ i : i
                        let str = month + "-" + date
                        this.day.push(str)
                    }
                    break
            }
        },
        getData(year){
            this.chart.showLoading()
            this.axios.post('/getTextByMonth', {
                endTime: year + '-' + this.day[this.day.length - 1],
                startTime: year + '-' + this.day[0]
            }).then(res => {
                if(res.data.message !== 'OK') {
                    this.$message({
                        message: res.data.message,
                        type: 'warning'
                    })
                    return 
                }
                if(!res.data.docObj) {
                    this.docArr = new Array(this.day.length).fill(0)
                } else {
                    this.docArr = this.objToArr(res.data.docObj)
                }
                if(!res.data.userObj) {
                    this.userArr = new Array(this.day.length).fill(0)
                } else {
                    this.userArr = this.objToArr(res.data.userObj)
                }
                this.chart.setOption({
                    xAxis: [
                        {
                            type: "category",
                            data: this.day
                        },
                    ],
                    series: [
                        {
                            name: "医生",
                            data: this.docArr
                        },
                        {
                            name: "普通用户",
                            data: this.userArr
                        }
                    ]
                })
                this.chart.hideLoading()
            }).catch(err => {
                console.log(err)
            })
            this.chart.hideLoading()
        },
        
        objToArr(obj) {
            let arr = new Array(this.day.length).fill(0)
            for(let i=0; i < obj.length; i++) {
                let index = this.day.indexOf(obj[i]._id)
                arr[index] = obj[i].value
            }
            return arr
        },
    },
    created() {
        this.getDay(this.time)
    },
    watch: {
        time(newVal, oldVal){
            this.getDay(newVal)
            this.getData(newVal[0])
            return newVal
        }
    }
}
</script>

<style lang='less' scoped>
</style>