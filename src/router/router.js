let pro = '/medical'
export const routes = [
    {
        path: '/',
        name: '首页',
        component: () => import('@/views/index.vue'),
        meta: {
            title: '首页'
        },
        redirect: '/medical',
        children: [
            {
                path: 'medical',
                component: () => import('@/views/Main/index.vue'),
                meta: {
                    title: "主页"
                }
            },
            {
                path: 'user',
                component: () => import('@/views/User/index.vue'),
                meta: {
                    title: "用户主页"
                },
                redirect: "/user/myzl",
                children: [
                    {
                        path: "myzl",
                        meta: {
                            title: "我的资料"
                        },
                        component: () => import('@/views/User/MyZL/index.vue'),
                    },
                    {
                        path: "edit",
                        meta: {
                            title: "编辑资料"
                        },
                        component: () => import('@/views/User/MyZL/edit.vue')
                    },
                    {
                        path: "mymessage/private",
                        meta: {
                            title: "我的私信"
                        },
                        component: () => import('@/views/User/MyMessage/private.vue')
                    },
                    {
                        path: "mymessage/reply",
                        meta: {
                            title: "我的回复"
                        },
                        component: () => import('@/views/User/MyMessage/reply.vue')
                    },
                    {
                        path: "friList/myfocus",
                        meta: {
                            title: "我的关注"
                        },
                        component: () => import('@/views/User/FriList/focus.vue')
                    },
                    {
                        path: "friList/myfans",
                        meta: {
                            title: "我的粉丝"
                        },
                        component: () => import('@/views/User/FriList/fans.vue')
                    },
                    {
                        path: "mypub",
                        meta: {
                            title: "我的发布"
                        },
                        component: () => import('@/views/User/MyPub/index.vue')
                    },
                    {
                        path: "security",
                        meta: {
                            title: "安全中心"
                        },
                        component: () => import('@/views/User/Security/index.vue')
                    },
                    {
                        path: "sysNotice",
                        meta: {
                            title: "系统通知"
                        },
                        component: () => import('@/views/User/SysNotice/index.vue')
                    }
                ]
            },
            {
                path: 'search',
                component: () => import('@/views/Search/index.vue'),
                meta: {
                    title: "搜索页"
                }
            },
            {
                path: 'detail',
                component: () => import('@/views/Detail/index.vue'),
                meta: {
                    title: "详情页"
                }
            },
            {
                path: 'more',
                component: () => import('@/views/More/index.vue'),
                meta: {
                    title: "更多"
                }
            },
            {
                path: 'notice',
                component: () => import('@/views/More/notice.vue'),
                meta: {
                    title: "公告列表"
                }
            },
            {
                path: 'userDetail',
                component: () => import('@/views/UserDetail/index.vue'),
                meta: {
                    title: "用户详情"
                }
            },
        ]
    },
    {
        path: '/admin',
        name: "管理员",
        component: () => import('@/views/Admin/index.vue'),
        meta: {
            title: "管理员"
        },
        redirect: "/admin/analysis",
        children: [
            {
                path: 'analysis',
                meta: {
                    title: '数据统计'
                },
                component: () => import('@/views/Admin/Analysis/index.vue')
            },
            {
                path: 'main',
                meta: {
                    title: "轮播图"
                },
                component: () => import('@/views/Admin/Main/index.vue'),
                redirect: "/admin/main/banner",
                children: [
                    {
                        path: 'banner',
                        meta:{
                            title: "轮播图"
                        },
                        component: () => import('@/views/Admin/Main/main.vue')
                    },
                    {
                        path: 'edit',
                        meta:{
                            title: "轮播图编辑"
                        },
                        component: () => import('@/views/Admin/Main/edit.vue')
                    }
                ]
            },
            {
                path: 'pub',
                meta: {
                    title: "公告管理"
                },
                component: () => import('@/views/Admin/Pub/index.vue'),
                children: [
                    {
                        path: "allPub",
                        meta: {
                            title: "查看公告"
                        },
                        component: () => import('@/views/Admin/Pub/allPub.vue')
                    },
                    {
                        path: "pubText",
                        meta: {
                            title: "发布公告"
                        },
                        component: () => import('@/views/Admin/Pub/pubText.vue')
                    },
                    {
                        path: "pubDetail",
                        meta: {
                            title: "公告详情"
                        },
                        component: () => import('@/views/Admin/Pub/detail.vue')
                    }
                ]
            },
            {
                path: 'user',
                meta: {
                    title: "用户管理"
                },
                component: () => import('@/views/Admin/User/index.vue'),
                redirect: "/admin/user/auth",
                children: [
                    {
                        path: 'auth',
                        meta: {
                            title: '认证管理'
                        },
                        component: () => import('@/views/Admin/User/auth.vue')
                    },
                    {
                        path: 'all',
                        meta: {
                            title: '所有用户'
                        },
                        component: () => import('@/views/Admin/User/all.vue')
                    },
                    {
                        path: 'moreUser',
                        meta: {
                            title: '查看更多'
                        },
                        component: () => import('@/views/Admin/User/more.vue')
                    },
                    {
                        path: 'detail',
                        meta: {
                            title: '详细资料'
                        },
                        component: () => import('@/views/Admin/User/detail.vue')
                    }
                ]
            },
            {
                path: 'userText',
                meta: {
                    title: "用户发表文章"
                },
                redirect: "/admin/userText/normal",
                component: () => import('@/views/Admin/Text/index.vue'),
                children: [
                    {
                        path: "normal",
                        meta: {
                            title: "普通用户文章"
                        },
                        component: () => import('@/views/Admin/Text/normal.vue')
                    },
                    {
                        path: "doctor",
                        meta: {
                            title: "医生用户文章"
                        },
                        component: () => import('@/views/Admin/Text/doctor.vue')
                    },
                    {
                        path: "detail",
                        meta: {
                            title: "用户文章详情"
                        },
                        component: () => import('@/views/Admin/Text/detail.vue')
                    }
                ]
            },
            {
                path: 'security',
                meta: {
                    title: "安全中心"
                },
                component: () => import('@/views/Admin/Security/index.vue')
            },
        ]
    },
    {
        path: pro + '/login',
        name: "登录注册",
        component: () => import('@/views/login.vue'),
        meta: {
            title: "登录注册"
        }
    },
    {
        path: pro + '/updpwd',
        name: "忘记密码",
        component: () => import('@/views/updpwd.vue'),
        meta: {
            title: "忘记密码"
        }
    },
    {
        path: "*",
        name: "404",
        component: () => import('@/views/error.vue'),
        meta: {
            title: "404page"
        }
    }
]
