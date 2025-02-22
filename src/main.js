import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3000'
}))

// 引用element组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
Vue.use(ElementUI);

// 引入css文件和less
import './assets/css/style.css'
import './assets/iconfont/iconfont.css'
import less from 'less'
Vue.use(less)

// 图片预览
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);

Vue.prototype.axios = axios
Vue.config.productionTip = false

// 过滤器
Vue.filter('timeFilter', (value='', format) => {
  if(value === ''){
    return ''
  }
  if(value === '-'){
    return ''
  }
  let time
  if(typeof value === 'string' && value.includes("-")){
    time = new Date(value)
  } else {
    time = new Date(parseInt(value))
  }
  let year = time.getFullYear()
  let month = time.getMonth()+1
  let day = time.getDate()
  let hours = time.getHours()
  let minutes = time.getMinutes()
  let seconds = time.getSeconds()
  month = month >= 10? month : '0' + month
  day = day >= 10? day : '0' + day
  hours = hours >= 10? hours : '0' + hours
  minutes = minutes >= 10? minutes : '0' + minutes
  seconds = seconds >= 10? seconds : '0' + seconds
  if(format === 'yyyy-MM-dd'){
    return year+'-'+month+'-'+day
  } else if(format === 'yyyy-MM-dd hh:mm:ss'){
    return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds
  } else if(format === 'chat'){
    return hours+':'+minutes
  }
})
Vue.filter('numFilter', (value, format) => {
  if(value >= 10000){
    return (value/10000).toFixed(2) + 'w'
  }
  return value
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
