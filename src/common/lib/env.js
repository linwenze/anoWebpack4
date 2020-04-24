/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = ''; 
let host = '';
let routerMode = 'history';
let imgBaseUrl = 'http://images.cangdu.org/';
let oldHost='';//旧系统
let phpHost=''; // phpHost 前后端不分离项目用到
let loginSocketHost=''; // 登录停留时间socket
baseUrl = '';
let APIDEV=process.env.APIDEV;
switch (APIDEV) {
  case 'test':
    baseUrl = 'https://pcapi.test-chexiu.cn';
    oldHost='https://pcv8.test-chexiu.cn';
    phpHost = ".test-chexiu.cn";
    loginSocketHost = 'wss://wss.test-chexiu.cn';
    break;
  case 'prod':
    baseUrl = 'https://pcapi.chexiu.cn';
    oldHost='https://pcv8.chexiu.cn';
    phpHost = ".chexiu.cn";
    loginSocketHost = 'wss://wss.chexiu.cn';
    break;
  case 'demo':
  baseUrl = 'https://newpc.demo-chexiu.cn';
  oldHost='https://pcv8.demo-chexiu.cn';
  phpHost = ".demo-chexiu.cn";
  loginSocketHost = 'wss://wss.demo-chexiu.cn';
  break;
  case 'dev':
    baseUrl = 'https://pcapi-zd.dev-chexiu.cn';
    oldHost='https://pcv8-zd.dev-chexiu.cn';
    phpHost= ".dev-chexiu.cn";
    loginSocketHost = 'wss://wss-zd.dev-chexiu.cn';
  break;
}

export {
  baseUrl,
  routerMode,
  imgBaseUrl,
  oldHost,
  host,
  phpHost,
  loginSocketHost
}
