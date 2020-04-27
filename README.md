
###ano-vue非常好用的面向对象和注解编程
####功能简介:ano-vue脚手架工具是vue-cli3.0的超级 支持热启动，扩展功能如下：
1. 仅仅需要命令行就可以自动化创建页面，组件，以及创建其依赖关系，提高开发效率。
2. 自动化路由配置，无需手动添加路由项。
4. 动态切换代理,启动服务的时候只需要在命令行中添加需要切换的代理环境变量即可。
5. 标准化的代码及目录模版，统一前端代码风格。
6. 页面脚本按需加载，解决了单应用打包大的问题。
7. 面向对象和注解的编程体验，大大加强了代码的复用性和降低了代码的耦合度。

使用命令: 
```
ano-vue -c view list
```
这个命令的意思是 创建一个视图层的页面 list 

```
ano-vue -c model user
```
创建一个user的实体类model
详细使用方法请往http://uyi2.com/docs?id=423
 
### 1、安装

```
git clone https://github.com/linwenze/anoWebpack4.git
cd anoWebpack4
npm install
```
### 2、运行
```
npm run start-dev //开发环境
npm run start-test //测试环境
npm run start-prod //生产环境
```
### 3、打包
```
npm run build-dev //开发环境
npm run build-test //测试环境
npm run build-prod //生产环境
```
- 开发环境打包生成后放在根文件下的dev文件夹
- 测试环境打包生成后放在根文件下的dist文件夹
- 生产环境打包生成后放在根文件下的prod文件夹
###4、自动用svg生成iconfont字体图标，支持webpack热重载
- 开发时在src/assets/iconfont/svgs目录下，修改或添加、删除svg文件，可自动生成字体图标（支持ttf,woff2,woff,eot,svg）及配套的css样式、html预览；同时热重载立即可以看到效果。

####安装插件
```
npm install webpack-iconfont-plugin-nodejs --save
```
#### webpack添加
```javascript
var dir = 'src/assets/iconfont'
var WebpackIconfontPluginNodejs = require('webpack-iconfont-plugin-nodejs');
if (process.env.NODE_ENV === 'production') {
  //module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: 'index.html',
      inject: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        APIDEV:JSON.stringify(process.env.APIDEV)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new WebpackIconfontPluginNodejs({
      fontName: 'my-icons',
      cssPrefix: 'ico',
      svgs: path.join(dir, 'svgs/*.svg'),
      // template: path.join(dir, 'css.njk'), 
      fontsOutput: path.join(dir, 'fonts/'),
      cssOutput: path.join(dir, 'fonts/font.css'),
      htmlOutput: path.join(dir, 'fonts/_font-preview.html'),
      jsOutput: path.join(dir, 'fonts/fonts.js'),
      // formats: ['ttf', 'woff', 'svg'],
    }),
  ])
}
```
main.js引入字体图标css
```
import '@assets/iconfont/fonts/font.css' 
```

### 5、element-ui按需加载，主题色全局切换
css按需加载的来源直接指向element-ui的scss文件，而不是预编译的css文件。通过join-file-content-plugin插件在编译时将src/assets/css/element-theme/theme-changed.scss文件 附加到element-ui主题变量文件element-theme-chalk/src/common/var.scss之前，实现了在修改scss变量后即可立马查看效果，无需预先编译element-ui的scss文件为css文件。同时可以在项目任意地方引用element-ui的scss变量。
#### vue+ElementUI改变主题色

- 进入项目文件夹 cd element-demo

- 安装主题生成工具npm i element-theme -g

- 安装白垩主题（不可以省略）npm i element-theme-chalk -D

- 改变初始变量文件et -i，会在根目录下多出一个element-variables.scss文件

- 找到element-variables.scss文件，修改主题色变量（primary)和其他要改变的颜色(eg：danger)
- 编译主题et

- 引入自定义主题，保存后，就可以看到颜色已变为了你设置的颜色
