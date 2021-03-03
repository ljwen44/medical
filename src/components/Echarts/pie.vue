<template>
    <div class="echarts">
        <div :style="{height:'400px',width:'100%'}" ref="barEchart"></div>
    </div>
</template>

<script>
export default {
    name: "pieEcharts",
    props: {
        flag: Boolean,
        title: String
    },
    data() {
        return {
            userColor: ['#7bd4f1', '#2a97bb'],
            textColor: ['#2a97bb', '#7bd4f1'],
            chart: null
        }
    },
    mounted() {
        this.chinaConfigure()
        window.addEventListener('resize', () => {
            this.chart.resize()
        })
        this.getData()
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
            this.chart = this.$echarts.init(this.$refs.barEchart); //这里是为了获得容器所在位置
            this.chart.setOption({
                title: {
                    text: this.title,
                    left: 'left',
                    top: 20,
                    textStyle: {
                        color: '#3cabcf'
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    data: ['医生', '普通用户']
                },
                series: [
                    {
                        name: this.title,
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [],
                        roseType: 'radius',
                        labelLine: {
                            smooth: 0.2,
                            length: 10,
                            length2: 20
                        },
                        itemStyle: {
                            color: (params) => {
                                if(this.flag) {
                                    return this.userColor[params.dataIndex]
                                } else {
                                    return this.textColor[params.dataIndex]
                                }
                            },
                        },
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
            })
        },
        getData() {
            if(this.flag) {
                this.getUserData()
            } else {
                this.getTextData()
            }
        },
        getUserData(){
            this.chart.showLoading()
            this.axios.get('/userTypeCompare')
            .then(res => {
                this.chart.setOption({
                    series: {
                        name: "用户类型",
                        data: res.data.data.sort((a, b) => { 
                            return a.value - b.value 
                        })
                    }
                })
                this.chart.hideLoading()
            }).catch(err => {
                console.log(err)
            })
        },
        getTextData(){
            this.chart.showLoading()
            this.axios.get('/textByUser')
            .then(res => {
                this.chart.setOption({
                    series: {
                        name: this.title,
                        data: res.data.data.sort((a, b) => { 
                            return a.value - b.value 
                        })
                    }
                })
                this.chart.hideLoading()
            }).catch(err => {
                console.log(err)
            })
        }
    },
}
</script>

<style lang='less' scoped>
</style>