module.exports = {
  "dev": {
      '/api/*': {
          target: 'https://pcapi.test-chexiu.cn/coupon/',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          },
          API_ROOT: ' "http://localhost:3001/api"'
      },
      API_ROOT: ' "http://localhost:3000/api"'

  },
  API_ROOT: ' "http://localhost:3002/api"'
}
