window.ENV =require('./env.js')
// console.log(baseUrl)
window.stores = {};
window.axios = require('axios');

var Decorator = {
    component(target, key, descriptor) {
        var instance = new target();
        /**处理继承 start*/
        var basePro = instance.__proto__.__proto__;
        var basePros = Object.getOwnPropertyNames(basePro);
        var baseClassName = basePro.constructor.name;
        /**处理继承 end*/
   
        if(!target.options) {
            target.options = {};
        }
        var options = {
            data() {//绑定属性
                var pdata = target.prototype.data ? target.prototype.data.apply(this) : {};
                Object.assign(pdata, instance);
                Object.assign(pdata, target.provider);
                if(baseClassName != "Object") {
                    for(key in basePros) {
                        if(basePros[key] != "constructor") {
                            pdata[basePros[key]] = basePro[basePros[key]];
                        }
                    }
                }
                return pdata;
            },
            watch: target.prototype.watch ? target.prototype.watch() : {},
            computed: target.prototype.computed ? target.prototype.computed() : {},
            filters: target.prototype.filters ? target.prototype.filters() : {},
            components: (function() {
                var com = {};
                if(target.prototype.components) {
                    var components = target.prototype.components();
                    for(var name in components) {
                        components[name].options.name = name;
                        com[name] = components[name].options;
                    }
                }
                return com;
            })(),
            mounted: target.prototype.mounted || new Function(),
            beforeMount: target.prototype.beforeMount || new Function(),
            beforeCreate: function() {
                function GetQueryValue(queryName) {
                    var params = location.href.split("?");
                    var query = decodeURI(params[1] ? params[1] : "");
                    var vars = query.split("&");
                    for (var i = 0; i < vars.length; i++) {
                        var pair = vars[i].split("=");
                        if (pair[0] == queryName) { return pair[1]; }
                    }
                    return null;
                }
                if(target.urlParams) {                   
                    if(!this.query) {
                        this.query = {};
                    }
                    for(var index = 0; index < target.urlParams.length; index++) {
                        this.query[target.urlParams[index]] = GetQueryValue(target.urlParams[index]);
                    }
                }
                target.prototype.beforeCreate ? target.prototype.beforeCreate.apply(this) : new Function();
            }, 
            created: function() {
                if (stores[target.name] && !stores[target.name].isRepeatReg) {
                    this.$store.registerModule(stores[target.name].alias, stores[target.name].store);
                    stores[target.name].isRepeatReg = true;
                    this[stores[target.name].alias] = this.$store.state[stores[target.name].alias];
                }
                target.prototype.created ? target.prototype.created.apply(this) : new Function();
            },
            beforeUpdate: target.prototype.beforeUpdate || new Function(),
            updated: target.prototype.updated || new Function(),
            beforeDestroy: target.prototype.beforeDestroy || new Function(),
            destoryed: target.prototype.destoryed || new Function(),
            methods: (function() {
                if(target.prototype.methods) {
                    return target.prototype.methods();
                }
            })()
        }
        Object.assign(target.options, options);
        return descriptor;
    },
    props(props) {
        return function(target, key, descriptor) {
            if(!target.options) {
                target.options = {};
            }
            target.options["props"] = props;
        } 
    },
    store(storeName, store) {
        return function(target, key, descriptor) {
            stores[target.name] = {
                alias: typeof storeName == "string" ? storeName : target.name + "Store",
                store: typeof storeName == "string" ? store : storeName,
            }
        }
    },
    autowire(params) {
        return function(target, key, descriptor) {
            if(params.moduleId) {
                var instance = new target();
                for(param in params) {
                    if(param != "moduleId") {
                        instance[param] = params[param];
                    } 
                }
                mobVue.classList[params.moduleId] = instance;
            } else {
                console.warn("autowire need moduleId, please check!");
            }
        }    
    },
    model(target) {
        function resetFunc(params, funcName) {
            var currentAttrFunc = target.prototype[funcName];
            target.prototype[funcName] = function(request) {
     var url = "";
                if(target.parentGlobalParams) {
                    url = "/" + target.parentGlobalParams.url + "/" + params.url;
                } else {
                    url = params.url;
                }
                var response = axios[params.type ? params.type : "get"](ENV.baseUrl + url, params.type == 'get' ? {                    params: request
                } : request);
                console.log(process.env)
                return currentAttrFunc(param, response);
            }
        }
        var proto = target.prototype;
        var funcList = Object.getOwnPropertyNames(proto);
        for(var index = 0; index < funcList.length; index++) {
             if(funcList[index] != "constructor") {
                if(target.globalParams && target.globalParams[funcList[index]]) { 
                    resetFunc(target.globalParams[funcList[index]], funcList[index]);
                }
             }
        } 
    },
    requestMapping(options) {
        return function(target, key, descriptor) {
            if(typeof target == "object") {
                if(!target.constructor.globalParams) {
                    target.constructor.globalParams = {};
                }
                target.constructor.globalParams[key] = options;
            } else {
                target.parentGlobalParams = options;
            }
        }
    },
    getMapping(options) {
        options.type = "get";
        return function(target, key, descriptor) {
            if(!target.constructor.globalParams) {
                target.constructor.globalParams = {};
            }
            target.constructor.globalParams[key] = options;
        } 
    },
    postMapping(options) {
        options.type = "post";
        return function(target, key, descriptor) {
            if(!target.constructor.globalParams) {
                target.constructor.globalParams = {};
            }
            target.constructor.globalParams[key] = options;
        } 
    }, 
    provider(params) {
        if(typeof params != "object") {
            console.warn("provider 注解参数必须为数组");
            return;
        }
        return function(target, key, descriptor) {
            if(!target.provider) {
                target.provider = {};
            }
            for(var index = 0; index < params.length; index++) {
                var providerObj = mobVue.require(params[index]);
                if(!providerObj) {
                    console.warn("provider 中的对象必须被声命为 autowire");
                    return;
                }
                target.provider[params[index]] = providerObj;
            }
            return descriptor;
        }
    },
    aspect(target) {
        target.prototype.apo = true;
    },
    before(target, key) {
        if(!target.constructor.aopList) {
            target.constructor.aopList = {
                "before": [],
                "after": []
            };
        }
        target.constructor.aopList.before.push(target[key]);
    },
    after(target, key) {
        if(!target.constructor.aopList) {
            target.constructor.aopList = {
                "before": [],
                "after": []
            };
        }
        target.constructor.aopList.after.push(target[key]);
    },
    inject(param) {
        return function(target, key) {
            if(!target.constructor.agentFuncList) {
                target.constructor.agentFuncList = [];
            }
            target.constructor.agentFuncList.push({
                proxyName: param,
                funcName: key
            });
        }
    },
    agent(target) {
        function isNeedAop(funcName) {
            for(var index = 0; index < target.agentFuncList.length; index++) {
                if(funcName == target.agentFuncList[index].funcName) {
                    return true;
                }
            }
            return false;
        }
        function resetFunc(funcName) {
            var currentAttrFunc = target.prototype[funcName];
            target.prototype[funcName] = function() {
                var beforeFuncList = [];
                var afterFuncList = [];
                var agentFuncList = target.agentFuncList;
                var aopObj = null;
                for(var index = 0; index < agentFuncList.length; index++) {
                    if(agentFuncList[index].funcName == funcName) {
                        aopObj = mobVue.require(agentFuncList[index].proxyName);
                        break;
                    }
                }
                if(aopObj) {
                    beforeFuncList = aopObj.constructor.aopList.before;
                    afterFuncList = aopObj.constructor.aopList.after;
                }
                //执行前
                for(var index = 0; index < beforeFuncList.length; index++) {
                    beforeFuncList[index].apply(aopObj, arguments);
                }
                //执行中
                var result = currentAttrFunc.apply(this, arguments);
                //执行后
                for(var index = 0; index < afterFuncList.length; index++) {
                    afterFuncList[index].apply(aopObj, arguments);
                }
                return result;
            }
        }
        var proto = target.prototype;
        var funcList = Object.getOwnPropertyNames(proto);
        for(var index = 0; index < funcList.length; index++) {
             if(isNeedAop(funcList[index])) {
                resetFunc(funcList[index])
             }
        } 
    },
    urlParams(params) {
        return function(target) {
            target.urlParams = params;
        }
    }
} 
module.exports = Decorator;
