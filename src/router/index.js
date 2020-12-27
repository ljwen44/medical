import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './router.js'
import state from '../store/state'
import mutations from '../store/mutations'

Vue.use(Router)
const router = new Router({
    linkActiveClass: 'rou-active',
    base: '/duanzi/',
    routes
})

router.beforeEach((to, from, next) => {
    window.scrollTo(0,0)
    next()
})// 全局守卫，判断权限

export default router