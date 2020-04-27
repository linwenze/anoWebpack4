import Vue from 'vue'
import VueRouter  from  'vue-router'
import App from './App'
import axios from 'axios'
import Vuex from 'vuex'
import autoWire from './common/lib/autoWire'
import routers from './controller'
import commonStore from './store'
import 'element-ui/lib/theme-chalk/index.css';
import Element from 'element-ui';
import '@assets/iconfont/fonts/font.css' 
import '@assets/css/index.scss' 
import '../theme/index.css' 

// 请求拦截器：在发送请求前拦截
axios.interceptors.request.use(config => {
  console.log('请求发送前拦截')
  config.headers.common['Authorization'] = 'Bearer bfas9kqj539r36o5cudgbbe8n1'
  return config;
}, error => {
  return Promise.reject(error)
})


import store from './store'
Vue.use(Element, { size: 'small', zIndex: 3000 });
Vue.use(VueRouter);
let router = new VueRouter({
  routes: routers
});
/**解决路由链接重复点击的bug start*/
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
/**解决路由链接重复点击的bug end*/
Vue.use(Vuex);
// const state = { 
//   myNmae:444
// }


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
