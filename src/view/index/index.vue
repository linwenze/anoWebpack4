<template>
    <div>
        这是首页
    </div>
</template>
<script>
    import {component,store} from '@common/lib/decorator'
    import BaseComponent from '@common/components/BaseComponent'
    import indexStore from './store'
    @component
    @store(indexStore)
    export default class index  extends BaseComponent {
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