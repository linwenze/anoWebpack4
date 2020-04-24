import {autowire,model,requestMapping,inject,agent} from '@common/lib/decorator.js'
import Base from './base'
@autowire({moduleId:"user"})
@model
@agent
export default class user extends Base {
    constructor() {
        super();
    }
    @inject("log")
    @requestMapping({url: "/coupon/single/index", type: "get"})
    getUserList(req, res) {
        return res;
        // alert('getUserList')
    }
    
    @requestMapping({url: "/api/v1/size", type: "get"})
    getUserSize(req, res) {
        return res;
    }
}