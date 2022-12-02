import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
// 创建并暴露一个路由器
export default new VueRouter({
    routes: [
        // 一级路由
        {
            path: '/',
            redirect: 'login'
        },
        {
            path: '/login',
            name: 'Login',
            component: () =>
                import("../views/Login.vue")
        },
        {
            path: '/manage',
            name: 'Manage',
            redirect: 'manage/home',
            component: () =>
                import("../views/Manage.vue"),
            // beforeEnter: (to, from, next) => {
            //     let token = localStorage.getItem('token');
            //     console.log(token)
            //     if (token == null || token == '' || token == 'undefined') {
            //         next('/login')
            //     } else {
            //         next();
            //     }
            // },
            children: [
                {
                    path: 'show',
                    name: 'Show',
                    component: () => import("../views/Show"),
                    // 路由缓存
                    meta:{
                        title:'show',
                        keepAlive: true
                    }
                },
                {
                    path: 'home',
                    name: 'Home',
                    component: () => import("../views/Home"),
                },
                {
                    path: 'edit',
                    name: 'Edit',
                    component: () => import("../views/Edit"),
                },
                {
                    path: 'box',
                    name: 'Box',
                    component: () => import("../views/Box"),
                },
                {
                    path: 'letter',
                    name: 'Letter',
                    component: () => import("../views/Letter"),
                },
                {
                    path: 'other',
                    name: 'Other',
                    component: () => import("../views/Other"),
                },
                {
                    path: 'search',
                    name: 'Search',
                    component: () => import("../views/Search"),
                }
            ]
        }
    ]
})