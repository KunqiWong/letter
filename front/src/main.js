import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import global from './utils/global'

Vue .prototype.$global = global

Vue.use(ElementUI,{size:'mini'});
Vue.config.productionTip = false
Vue.use(VueRouter)

//路由全局守卫，判断是否登录了
router.beforeEach((to,from,next) => {
    if(to.path === '/login'){
      next();
    }else{
      let token = localStorage.getItem('token');
      if(token == null || token == '' || token == 'undefined'){
        next('/login')
      }else{
        next();
      }
    }
})
// const demo = Vue.extend({})
// const d = new demo()

// // 组件通讯  d现在就是vc
// Vue.prototype.x = d

new Vue({
    render: h => h(App),
    router: router,
    //安装全局事件总线
    beforeCreate() {
        Vue.prototype.$bus = this
    }
}).$mount('#app')