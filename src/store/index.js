import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters' 


Vue.use(Vuex)
const state = { 
  loadingShow:{},
  userInfo:{},//用户登录
  
}
export default new Vuex.Store({
	state,
	getters,
	actions,
  mutations,
  modules:{
  }
})
