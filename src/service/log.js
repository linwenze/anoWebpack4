import {autowire,aspect,before,after} from '@common/lib/decorator.js'
@autowire({"moduleId": "log"})
@aspect
export default class log {
    @before
    recordExecBeforeTime() {
        // alert('before')
    }
    @after
    recordExecAfterTime() {
        // alert('after')

    }
}