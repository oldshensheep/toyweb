import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import { check } from "@/api/config";
import "./registerServiceWorker";
Vue.config.productionTip = false;

new Vue({
  data() {
    return {
      isLoading: true,
    };
  },
  created() {
    if (sessionStorage.redirect) {
      const redirect = sessionStorage.redirect;
      delete sessionStorage.redirect;
      this.$router.push(redirect);
    }
    check();
  },
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
