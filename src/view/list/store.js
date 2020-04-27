export default {
    namespaced : true,
    state : {
        
    },
    mutations : {
        
    },
    actions : {
        error({ commit }, tips) {
            Notification.error({
                  title: '错误提示', 
                  message: tips
            })
          },
          success({ commit }, tips) {
            Notification.success({
                  title: '操作提示',
                  message: tips
            })
          },
          warning({ commit }, tips) {
            Notification.warning({
                  title: '操作提示',
                  message: tips
            })
          },
        
    },
    getters : {
      
    }
}