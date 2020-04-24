class AutoWire {
    constructor() {
        window.mobVue = {
            classList: {},
            require(moduleId) {
                return mobVue.classList[moduleId] ? mobVue.classList[moduleId] : null; 
            }
        }
        this.autoScan();
    }
    autoScan()  {
        require("./autoLoadPathMap");
    }    
}
export default new AutoWire