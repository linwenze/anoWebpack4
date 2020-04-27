import { Loading } from 'element-ui';
export default {
  /**设置任务状态
   * @param     {[taskObject]}    OBJECT
   */
  setSex(state, sex){
    state.sex=sex 
  }, 
  openLoading(state) {
    state.loadingShow = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
  },
  closeLoading(state) {
    state.loadingShow.close()
  },
  
}
