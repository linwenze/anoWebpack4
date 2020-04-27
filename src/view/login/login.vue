<template>
    <div>
        <button @click="test">fdf</button>
        <button @click="test2">fdf</button>
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
                
            }
        }
        created() {
            
        }
        mounted() {
         
        }
        methods() {
            return {
                test(){
                    this.user.getUserList().then((res)=>{
                        console.log(res);
                  
                    }).catch((error, res) => {
                        console.log(error)
                        if (error.response && error.response.data.code == 401) {
                            alert( error.response.data.msg)
                        }
                    }); 
                },
                test2(){
                    alert(5)
                }
               
            }    
        }
    }
</script>

<style scoped>
    
</style>