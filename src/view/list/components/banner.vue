<template>
    <div>
        {{username}}
    </div>
</template>
<script>
   import {component, props} from '@common/lib/decorator'
    import BaseComponent from '@common/components/BaseComponent'
    @component
    @props({"username": String})
    export default class banner  extends BaseComponent {
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