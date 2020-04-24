<template>
    <div>
       {{$store.state.userStore.myName}}
    </div>
</template>
<script>
    import {component,store} from '@common/lib/decorator'
    import BaseComponent from '@common/components/BaseComponent'
    import userStore from './store'
    @component
    @store(userStore)
    export default class user  extends BaseComponent {
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
               
            }    
        }
    }
</script>

<style scoped>
    
</style>