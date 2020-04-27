<template>
    <div>
        <button @click="test">测试调用接口</button>
        <div v-for="(item, index) in list" :key="index">
            {{item.title}}
        </div>
    </div>
</template>
<script>
    import {component,store,provider} from '@common/lib/decorator'
    import BaseComponent from '@common/components/BaseComponent'
    import listStore from './store'
    @component
    @store(listStore)
    @provider(["user"])
    export default class list  extends BaseComponent {
        constructor() {
            super();
        }
        data() {
            return {
                list:[]
            }
        }
        created() {
            
        }
        mounted() {
         
        }
        methods() {
            return {
                test(){
                    let page=parseInt(Math.random()*10);
                    this.user.getUserList({page,size:20}).then((res)=>{
                        console.log(res);
                        console.log(res.data.data.list.data)
                        this.list=res.data.data.list.data;
                  
                    })
                },
               
               
            }    
        }
    }
</script>

<style scoped>
    
</style>