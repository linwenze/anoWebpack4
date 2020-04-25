import Vue from 'vue'
import VueRouter  from  'vue-router'
import App from './App'
import Vuex from 'vuex'
import autoWire from './common/lib/autoWire'
import routers from './controller'
import commonStore from './store'
import 'element-ui/lib/theme-chalk/index.css';
import Element from 'element-ui';
import '@assets/iconfont/fonts/font.css' 
import '@assets/css/index.scss' 
import '../theme/index.css' 
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
const store = new Vuex.Store({
  ...commonStore,
  modules: {}
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
