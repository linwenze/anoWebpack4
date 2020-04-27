var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')
var proxyConfig = require('./proxy.config')
var autoWire = require('./autoWire');
var proxyApi = {};
var args = process.argv;
var proxyParam = args[args.length - 1];
if (proxyParam.indexOf("--apiProxy") > -1) {
  proxyParam = proxyParam.split("=")[1];
  proxyApi = proxyConfig[proxyParam]
  console.log("api代理设置成功:" + JSON.stringify(proxyApi));
}
var APIDEV="dev"
autoWire.autoScan();
switch (process.env.APIDEV) {
  case 'dev':
    APIDEV='./dev'
  break
  case 'test':
    APIDEV='./dist'
  break
  case 'demo':
    APIDEV='./demo'
  break
  case 'prod':
    APIDEV='./release'
  break
  default:
    APIDEV='./prod'
    break;
}
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, APIDEV),
    publicPath: '/',
    filename: 'build.js',
    chunkFilename:'[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      }, 
      {
        test: /\.s[a|c]ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
        },     
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {//如果有这个设置则不用再添加.babelrc文件进行配置
          "plugins": [
              "dynamic-import-webpack"
          ]
        },
        exclude: /node_modules/
      },
      {
        test: /\.(ttf|woff|woff2|eot|png|jpg|jpeg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name].[ext]?[hash]',
            outputPath: './assets',
            publicPath: '/assets',
            limit: 1024, //限制打包图片的大小：
          }
        }]
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),  
      'vue$': 'vue/dist/vue.esm.js',
      '@assets': path.resolve(__dirname, 'src', 'assets'),
      '@common': path.resolve(__dirname, 'src', 'common'),
      '@controller': path.resolve(__dirname, 'src', 'controller'),
      '@model': path.resolve(__dirname, 'src', 'model'),
      '@service': path.resolve(__dirname, 'src', 'service'),
      '@view': path.resolve(__dirname, 'src', 'view'),
      '@commonStore': path.resolve(__dirname, 'src', 'commonStore'),
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    hot: true,
    proxy: proxyApi
  },
  performance: {
    hints: false
  }
  // devtool: '#eval-source-map'
}
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
}else{
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        APIDEV:JSON.stringify(process.env.APIDEV)
      }
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
