<template>
    <div id="weather-v2-plugin-standard" style="width: 100%; background-size: 100%;"></div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    created() {
        var wb = 'WIDGET = {FID: "123456", CONFIG: {"layout": 2,"width": "230","height": "270","background": 1,"dataColor": "FFFFFF","borderRadius": 5,"key": "6TeA0cyLgq"}}'
        var c = document.createElement('link')
        c.rel = 'stylesheet'
        c.href = 'https://apip.weatherdt.com/standard/static/css/weather-standard.css?v=2.0'
        var s = document.createElement('script')
        s.src = 'https://apip.weatherdt.com/standard/static/js/weather-standard-common.js?v=2.0'
        var sn = document.getElementsByTagName('script')[0]
        var w = document.createElement('script')
        w.type = 'text/javascript'
        w.innerHTML = wb
        sn.parentNode.insertBefore(c, sn)
        sn.parentNode.insertBefore(s, sn)
        sn.parentNode.insertBefore(w, sn)
    },
    methods: {

    },
}
</script>

<style lang="less" scoped>
/deep/
#weather-v2-plugin-standard{
    margin: 0 auto;
}
</style>