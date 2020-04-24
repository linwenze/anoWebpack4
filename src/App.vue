<template>
  <div id="app">
    <!-- <el-scrollbar class="scroll-box" id="elscrollbar"> -->
<!-- <keep-alive>
      <router-view v-if="isView" class="main-box"/>
</keep-alive> -->

<keep-alive v-if="isView">
  <router-view v-if="$route.meta.keepAlive"></router-view>
  <!--这里是会被缓存的组件-->
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"></router-view>

    <!-- </el-scrollbar> -->
  </div>
</template>
<script>
import store from "./store";
import { setTimeout } from 'timers';
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload,
      gethosts:this.gethosts(),
      checkSecondMenuAuth: this.checkSecondMenuAuth
    }
  },
  data () {
    return {
      isView: true,
      lastPath: '', // 记录上一次登陆的路径，用来webscoket
    }
  },
  created(){ 
    console.log('登录成功之后会开启socket服务，并启动定时器去请求 socket心态检测接口');
    clearInterval(window.timer2);
    window.timer2 = setInterval(this.isOpenSocket, 6000);
  },
  methods: {
    isOpenSocket(){
      let stay_id = sessionStorage.getItem('stay_id')?JSON.parse(sessionStorage.getItem('stay_id')):'';
      let token = localStorage.getItem('user_login')?JSON.parse(localStorage.getItem('user_login')).token:''
      if(stay_id){
        if(!store.getters.loginSocket){
          clearInterval(window.timer2);
          this.socketApi.initWebSocket();
          this.loginSocket(stay_id);
          let href = window.location.href;
          this.changeViewForSocket(href);
          // this.typeSocket(); // 放到 changeViewForSocket里面
        }else{
        }
        clearInterval(window.timer);
        
        this.heartbeat();
        window.timer = setInterval(this.isOpenSocket, 6000);
      }else if(!stay_id && token){
        if(this.$route.path == '/login'){

        }else{
          if(!this.flag){
            setTimeout(()=>{
              this.loginStay();
            }, 1000)
          }
          
        }
      }else{
        console.log('不需要记录登录时长了')
      }
      
    },
    heartbeat() {
      try {
          this.socketApi.sendSock(
            {
              c: 'common',
              m: "setHeart"
            },
            this.getData
          );
      } catch (err) {
          console.log("断线了: " + err);
          this.socketApi.initWebSocket();
      }
      
    },
    loginSocket(stayId){
      let token = localStorage.getItem('user_login')?JSON.parse(localStorage.getItem('user_login')).token:''
      try {
          this.socketApi.sendSock(
            {
              c: 'pc',
              m: 'loginStay',
              params: {
                stay_id: stayId,    // 动态改变的值
                token: token
              }
            },
            this.getData
          );
      } catch (err) {
          console.log("断线了: " + err);
      }
    },

    typeSocket(type=0){
      let token = localStorage.getItem('user_login')?JSON.parse(localStorage.getItem('user_login')).token:''
      try {
          this.socketApi.sendSock(
            {
              c: 'pc',
              m: 'stay',
              params: {
                type: type,    // 动态改变的值
                token: token,
                areaId: localStorage.getItem('user_login') && JSON.parse(localStorage.getItem('user_login')).area ?JSON.parse(localStorage.getItem('user_login')).area.id:'',
                accountId: localStorage.getItem('user_login') && JSON.parse(localStorage.getItem('user_login')).user ?JSON.parse(localStorage.getItem('user_login')).user.accountId:''
              }
            },
            this.getData
          );
      } catch (err) {
          console.log("断线了: " + err);
      }
    },

    loginStay() {
      this.flag = true;
      this.$fetch.login
        .loginStay({})
        .then(res => {
          sessionStorage.setItem(
            "stay_id", JSON.stringify(res.data.stay_id)
          );
          this.socketApi.initWebSocket();
          this.loginSocket(res.data.stay_id);
          let href = window.location.href;
          this.changeViewForSocket(href);
          // this.typeSocket(); // 放到 changeViewForSocket里面
          this.flag = false;
          clearInterval(window.timer);
          
          this.heartbeat();
          window.timer = setInterval(this.isOpenSocket, 6000);
          
        })
        .catch(err => {
        });
    },

    checkSecondMenuAuth(checkpath){
      /*
      说明： Angular 跳转 检查二级菜单权限  ，vue的路由跳转检查已经写在 vue-router里面了
      参数： param checkpath 代表要检查的二级菜单是否存在，例子：customer.cluemanage
      返回：  true or  false   ,  false 代表无权限
      调用例子：
        在组件内 声明 inject
          inject:['checkSecondMenuAuth'],
          在跳转anguarl地址的时候 做判断
          if(this.checkSecondMenuAuth('business.wechatdialog')){
                window.location.href =  'Angular href';
          }
      */
      let secondAuths =  [];
      secondAuths = JSON.parse(window.localStorage.getItem('secondAuths'));
      
      let hasAuth = false;
      if(secondAuths.length)
      {
          for(let v of secondAuths)
          {
            if(v.path == checkpath)
            {
              hasAuth = true;
            }
          }
      }

      if(!hasAuth) {
        this.$store.dispatch("warning","无此功能权限");
      }
      return hasAuth;
    },
    reload () {
      this.isView = false;
      this.$nextTick(() => {
        this.isView = true;
      })
    },
    gethosts(){
      let host = window.location.hostname || window.location.host ,backObj = {};
      switch(host)
      {
        case 'localhost':
            backObj  =  {
                "oldHost": "https://pcv8.demo-chexiu.cn",
                "toolHost": "https://4stoolv8.demo-chexiu.cn",
                "ws": "ws://slot-srv.demo-chexiu.cn:8003",
                "flowHost": "https://pcapi.flow.demo-chexiu.cn",
              }        
        break;
        case 'pc.demo-chexiu.cn':
            backObj  =  {
                "oldHost": "https://pcv8.demo-chexiu.cn",
                "toolHost": "https://4stoolv8.demo-chexiu.cn",
                "ws": "ws://slot-srv.demo-chexiu.cn:8003",
                "flowHost": "https://pcapi.flow.demo-chexiu.cn",
              }
        break;
        case 'pc.dev-chexiu.cn':
          backObj  = {
              "oldHost": "https://pcv8.dev-chexiu.cn",
              "toolHost": "https://4stoolv8.dev-chexiu.cn",
              "ws": "ws://slot-srv.dev-chexiu.cn",
              "businessWs": "https://push-srv.dev-chexiu.cn",
              "flowHost": "https://pcapi-flow.dev-chexiu.cn",           
          }
        break;
        case 'pc.test-chexiu.cn':
          backObj  ={
              "oldHost": "https://pcv8.test-chexiu.cn",
              "toolHost": "https://4stoolv8.test-chexiu.cn",
              "ws": "ws://slot-srv.test-chexiu.cn",
              "businessWs": "https://push-srv.test-chexiu.cn",
              "flowHost": "https://pcapi-flow.test-chexiu.cn"          
          }
        break;
        case 'pc.chexiu.cn':
          backObj  = {
              "oldHost": "https://pcv8.chexiu.cn",
              "toolHost": "https://4stoolv8.chexiu.cn",
              "ws": "ws://slot-srv.chexiu.cn",
              "businessWs": "https://push-srv.chexiu.cn",
              "flowHost": "https://pcapi-flow.chexiu.cn",            
          }
        break;
      }

      return backObj;

    },
    changeViewForSocket(path){  
      // 2 market.softTemplate  3 market.posterTemplate   4 market.thermalMap  5 market.mobileTemplate
      // 其它菜单传0
      let currentPath = 'other';
      let type = 0;

      if(path.indexOf('/market/softTemplate') > -1){ // 图文，包括新增和编辑的图文模块
        currentPath = '/market/softTemplate';
        type = 2;
      }else if(path.indexOf('/market/posterTemplate') > -1){
        currentPath = '/market/posterTemplate';
        type = 3;
      }else if(path.indexOf('/market/thermalMap') > -1){
        currentPath = '/market/thermalMap';
        type = 4;
      }else if(path.indexOf('/market/mobileTemplate') > -1){
        currentPath = '/market/mobileTemplate';
        type = 5;
      }

      if(currentPath != this.lastPath){ // 重复不在一个状态，需要改变
        this.typeSocket(type);
      }

      this.lastPath = currentPath;
    }
  },
  watch: {
    $route(to,from){ 
    
      document.documentElement.scrollTop = document.body.scrollTop = 0;
      // 百度统计所以页面URL
      if(to.name != null){
      this.$ba.trackPageview(to.path+'/'+to.name)
      }

      // 群发助手--停留时长埋点  图文中心，海报模板，热文中心，活动模板这四个模块需要停留时间 不需要的模块传0
      // 刷新进入的时候，没有触发，需要在 created那里触发一下；
      this.changeViewForSocket(to.path);
    }
  },mounted(){

    //   let self = this;
    //   if ( '-ms-scroll-limit' in document.documentElement.style &&  '-ms-ime-align' in document.documentElement.style ) 
    //   { 
    //       window.addEventListener("hashchange", function(event) {
    //         var currentPath = window.location.hash.slice(1);
    //         console.log('触发了hashchange');
    //         if (self.$route.path !== currentPath) {
    //           self.$router.push(currentPath)
    //         }
    //       }, false)
    //   }

  }
};
</script>
<style scoped>
.main-box{
  min-width: 1300px;
}
.scroll-box{
  height: 100%;;
}
#app {
  width: 100%;
  height: 100%; 
  min-width: 1400px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
<style>

#app .el-scrollbar__wrap {
   overflow-x: hidden;
}
</style>

