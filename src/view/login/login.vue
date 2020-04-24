<template>
  <div class="login-container">
    <div class="logo">
      <div>
        <a
          class="alike"
          target="_blank"
          href="http://cst.chexiu.cn/"
        >
          <img src="../../assets/images/login/logo.png">
        </a>
      </div>
    </div>
    <div class="login-panel-content">
      <div class="login-panel-left">
        <img src="../../assets/images/login/login-plant-content.gif">
      </div>
      <div :class="['login-panel',{'login-panel-lg':false}]">
        <!-- <div class="text-center"><img class="logo" src="~@/assets/images/login/logo.png" alt=""/></div> -->
        <h2 class="text-center text-center—title">欢迎登录车商通SCRM</h2>
        <h4>4S店客户价值提升专家</h4>
        <el-form
          :model="loginData"
          @keyup.enter.native="submitForm"
          :rules="rules"
          ref="loginForm"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              type="text"
              v-model.trim="loginData.username"
              placeholder="账号"
              class="el-input-border"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model.trim="loginData.password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="remenber">
            <input
              type="checkbox"
              v-model="rememberme"
            >记住用户名
          </el-form-item>
          <el-form-item class="no-bottom">
            <el-button
              class="form-btn"
              type="primary"
              @click="submitForm"
              :loading="loading"
              :disabled="loginDisable"
            >
              登录<i v-if="loginDisable">中</i>
            </el-button>
          </el-form-item>
          <el-form-item class="margin-bottom-35">
            <div class="regiest">
              <a
                target="_blank"
                :href="gethosts.oldHost+'/signup'"
              >立即注册</a>|
              <a
                target="_blank"
                href="http://crm2.qq.com/page/portalpage/wpa.php?uin=4008591730&aty=0&a=0&curl=&ty=1"
              >联系客服</a>
            </div>
          </el-form-item>
          <el-form-item class="copyright-box">
            <div class="copyright">
              ©版权所有：深圳市驱动新媒体有限公司
              <a
                href="http://www.chexiu.cn/"
                target="_blank"
              >(www.chexiu.cn)</a>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
    import {component,store} from '@common/lib/decorator'
    import BaseComponent from '@common/components/BaseComponent'
    import loginStore from './store'
    @component
    @store(loginStore)
    export default class login  extends BaseComponent {
        constructor() {
            super();
        }
        
        data() {
            inject: ["gethosts"]
            return {
                headnavdata: "",
                loginSure: false,
                loginDisable: false,
                loginData: {
                    username: "",
                    password: ""
                },
                rules: {
                    username: [
                    { required: true, message: "请输入账号", trigger: ["blur", "change"] }
                    ],
                    password: [
                    { required: true, message: "请输入密码", trigger: ["blur", "change"] }
                    ]
                },
                loading: false,
                rememberme: false,
                user: {}
                            
            }
        }
        created() {
             this.initData();
            this.getCookie();
        }
        mounted() {
        }
        methods() {
            return {
                initData() {
                    localStorage.removeItem("userInfo");
                    if (localStorage.getItem("RememberMe")) {
                        this.rememberme = true;
                        const user = JSON.parse(localStorage.getItem("RememberMe"));
                        this.loginData.username = user.username;
                    }
                },
                submitForm() {

                // document.cookie = "PHPSESSID=" + ";" + "path=/" + ";domain=" + phpHost

                if (!this.loginData.username) {
                    this.$store.dispatch("warning", "请输入有效的用户名");
                    return;
                }

                if (!this.loginData.password) {
                    this.$store.dispatch("warning", "请输入有效的密码");
                    return;
                }

                this.loginDisable = true;
                const _this = this;
                this.loading = true;
                let { username, password } = this.loginData;
                let params = {
                    username: username,
                    psd: password,
                    clientVersion: "",
                    mac: "",
                    verifyCode: ""
                };
                this.$fetch.login
                    .loginOld(params)
                    .then(res => {
                    if (res.status == 0) {
                        this.$store.dispatch("error", res.msg);
                        this.loginDisable = false;
                    } else {
                        this.loginSure = true;
                        let shareKey = res.shareKey;
                        this.login(shareKey);
                    }
                    })
                    .catch(err => {
                    if (err.status == 0) {
                        this.$store.dispatch("error", err.msg);
                        this.loginDisable = false;
                    }
                    //旧系统登录失败
                    if (err.shareKey) {
                        // 请求旧接口成功返回来的可以
                        _this.login(err.shareKey);
                    }

                    var that = _this;
                    setTimeout(() => {
                        that.loading = false;
                    }, 2000);
                    if (window.location.origin.indexOf("localhost") > -1) {
                        //本地登录，本地登录旧接口不返回来，所以判断local进入
                        _this.login();
                    }
                    });
                },
                login(shareKey) {
                //这里的逻辑在GreenLogin.vue也有相同的一份逻辑，这里若需要改动，请在GreenLogin.vue也做相应改动
                let { username, password } = this.loginData;
                let params = { username, password };
                params.shareKey = shareKey;
                this.$fetch.login
                    .toLogin(params)
                    .then(res => {
                    let tableShowSelect = JSON.parse(localStorage.getItem("tableShowSelect")) || [];
                    localStorage.clear();
                    localStorage.setItem("tableShowSelect", JSON.stringify(tableShowSelect));   // 不想清除tableShowSelect
                    localStorage.setItem("user_info", JSON.stringify(res.data));
                    
                    document.cookie = "PHPSESSID=" + res.data.token + ";" + "path=/" + ";domain=" + phpHost; // 从vue跳过来后改变 PHPSESSID
                    this.checkRemenberMe();

                    this.setUserLog(res); // 保存user_login 跳到angular项目需要获取
                    this.saveUser(res.data); //保存用户信息
                    // 请求菜单权限
                    this.$fetch.header.getTopMune({}, true).then(res => {
                        this.headnavdata = res.data; //头部一级导航数据获取，放开注释即可获取
                        // this.headnavdata.push({    // 添加头部一级菜单（线索服务） - 提测时去掉
                        //   checked: false,
                        //   icon: null,
                        //   id: 287,
                        //   path: "groupbuyCar",
                        //   subnav: Array(0),
                        //   tags: null,
                        //   title: "线索服务",
                        // })
                        this.$store.commit("currentpath", this.headnavdata);
                        localStorage.setItem("navtree", JSON.stringify(res.data));

                        this.$router.push("/home");
                        var that = this;
                        setTimeout(() => {
                        that.loading = false;
                        }, 2000);

                        this.loginDisable = false;
                        this.loginSure = true;

                        if(shareKey){
                        let stay_id = sessionStorage.getItem('stay_id')?JSON.parse(sessionStorage.getItem('stay_id')):'';
                        
                        if(!stay_id){
                            this.loginStay();
                        }else{
                            console.log('不存在')
                        }
                        }

                        
                    });
                    })
                    .catch(err => {
                    this.loading = false;
                    this.loginDisable = false;
                    });
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

                loginStay() {
                this.$fetch.login
                    .loginStay({})
                    .then(res => {
                    sessionStorage.setItem(
                        "stay_id", JSON.stringify(res.data.stay_id)
                    );
                    this.socketApi.initWebSocket();
                    this.loginSocket(res.data.stay_id);
                    this.typeSocket();
                    })
                    .catch(err => {
                    });
                },

                typeSocket(){
                let token = localStorage.getItem('user_login')?JSON.parse(localStorage.getItem('user_login')).token:''
                try {
                    this.socketApi.sendSock(
                        {
                        c: 'pc',
                        m: 'stay',
                        params: {
                            type: 0,    // 动态改变的值
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

                checkRemenberMe() {
                const self = this;
                if (this.rememberme) {
                    // localStorage.setItem(
                    //   "RememberMe",
                    //   JSON.stringify({
                    //     username: this.loginData.username
                    //   })
                    // );
                    self.setCookie(self.loginData.username, self.loginData.password, 7);
                } else {
                    // localStorage.removeItem("RememberMe");
                    self.clearCookie();
                }
                },
                setCookie(c_name, c_pwd, exdays) {
                var exdate = new Date(); //获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
                //字符串拼接cookie
                window.document.cookie =
                    "userName" + "=" + this.loginData.username + ";path=/;expires=" +
                    exdate.toGMTString();
                window.document.cookie = "userPwd" + "=" + this.loginData.password + ";path=/;expires=" +
                    exdate.toGMTString();
                },
                getCookie: function() {
                if (document.cookie.length > 0) {
                    var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
                    for (var i = 0; i < arr.length; i++) {
                    var arr2 = arr[i].split("="); //再次切割
                    //判断查找相对应的值
                    if (arr2[0] == "userName") {
                        this.loginData.username = arr2[1]; //保存到保存数据的地方
                    } else if (arr2[0] == "userPwd") {
                        this.loginData.password = arr2[1];
                        this.rememberme = true;
                    }
                    }
                }
                },
                clearCookie: function() {
                this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
                },
                loginFn() {
                this.loading = true;
                let { username, password } = this.loginData;
                let params = { username: username, password: password };
                },
                setUserLog(res) {
                const { data } = res;
                let userInfo = res.data.admin;
                Object.assign(userInfo, {
                    service: res.data.service,
                    latitude: res.data.area.latitude,
                    longitude: res.data.area.longitude
                });
                localStorage.setItem(
                    "user_login",
                    JSON.stringify({
                    expired: +new Date() + 60 * 60 * 1000 * 24, // 1 day
                    token: res.data.token,
                    user: userInfo,
                    cookies: res.data.cookies,
                    area: res.data.area
                    })
                );
                },
                power(id, title) {
                this.num = 0;
                let params = "";
                let pass = 0;
                // for (let v of this.currentpath) {
                //   if (v.title == title || v.path == path) {
                //     params = v;
                //     pass += 1
                //   }
                // }

                // if(pass>0){
                let that = this;
                return new Promise(function(resolve, reject) {
                    that.$fetch.header
                    .getSubMenu({ column_id: id, column_name: title }, true)
                    .then(res => {
                    //      res.data[0].items.splice(6,0,{
                    //   "title": "跟进任务",
                    //   "id": 32614,
                    //   "path": "customer.followup",
                    //   "icon": "",
                    //   "tags": 0,
                    //   "is_buy": true,
                    //   "buy_url": ""
                    // })
                        console.log(res.data,'<><><><><>12')
                        resolve(res.data);
                        
                    });
                });
                }
            }
        }
        
    }
</script>

<style scoped>
</style>