import {autowire,aspect,before,after} from '@common/lib/decorator.js'
import store from '../store/index'
@autowire({"moduleId": "log"})
@aspect
export default class log  {
    @before
    recordExecBeforeTime() {
        // alert('before')
        store.commit('openLoading')
    }
    @after
    recordExecAfterTime() {
        console.log(this)
        store.commit('closeLoading')
    }
}