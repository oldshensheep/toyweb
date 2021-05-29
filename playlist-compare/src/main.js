import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import { check } from "@/api/config";
import './registerServiceWorker'
Vue.config.productionTip = false;

new Vue({
    data() {
        return {
            isLoading: true,
        };
    },
    created() {
        check();
    },
    vuetify,
    router,
    render: (h) => h(App),
}).$mount("#app");
