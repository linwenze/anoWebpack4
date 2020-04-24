<template>
    <div>
        <button @click="test">fdf</button>
        <button @click="test2">fdf</button>
    </div>
</template>
<script>
    import {component,store} from '@common/lib/decorator'
    import BaseComponent from '@common/components/BaseComponent'
    import listStore from './store'
    @component
    @store(listStore)
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
                    alert(4)
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