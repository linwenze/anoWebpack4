<template>
    <div >
        这是首页<i class="ico-view">dfdf</i>
        <el-button type="primary">主要按钮{{$store.state.indexStore.sex}}</el-button>
    </div>
</template>
<script>
    import {component,store} from '@common/lib/decorator'
    import BaseComponent from '@common/components/BaseComponent'
    import indexStore from './store'
    @component
    @store("indexStore", indexStore)
    export default class index  extends BaseComponent {
        constructor() {
            super();
        }
        data() {
            return {
                
            }
        }
        created() {
            console.log(this.$store)
        	// this.$store.commit("openLoading");
            
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