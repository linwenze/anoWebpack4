<template>
    <div >
        这是首页<i class="ico-view">dfdf</i>
        <el-button type="primary">主要按钮</el-button>
        <div class="test">ffdfdf</div>
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

<style scoped lang="scss">
@import "element-variables";
.test{
    color:#fff;
    background: $--color-primary;
}
</style>