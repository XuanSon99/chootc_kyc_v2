import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import i18n from "./i18n";
import vuetify from "./plugins/vuetify.js";
import '@fortawesome/fontawesome-free/css/all.min.css'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import './assets/css/style.css'
import './assets/css/responsive.css'

Vue.config.productionTip = false
Vue.config.silent = true
// Vue.config.errorHandler = function () {
// }
// Vue.config.warnHandler = function () {
// }

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
  position: "top-right",
});

Vue.prototype.image = function (url) {
  return process.env.VUE_APP_BASE_URL + "/storage/" + url;
},

Vue.prototype.CallAPI = function (method, url, data, callResponse, callError) {
  const config = {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("wallet_token")
    },
  };
  const baseurl = process.env.VUE_APP_BASE_URL
  const requestUrl = `${baseurl}/api/${url}`;
  switch (method) {
    case "post":
      axios.post(requestUrl, data, config).then((response) => {
        callResponse(response)
      })
        .catch((error) => {
          // console.clear();
          try {
            callError(error)
          } catch (error) {
          }
        })
      break;
    case "get":
      axios.get(requestUrl, config)
        .then((response) => {
          callResponse(response)
        })
        .catch((error) => {
          // console.clear();
          try {
            callError(error)
          } catch (error) {
          }
        })
      break;
    case "put":
      axios.put(requestUrl, data, config)
        .then((response) => {
          callResponse(response)
        })
        .catch((error) => {
          // console.clear();
          try {
            callError(error)
          } catch (error) {
          }
        })
      break;
    case "delete":
      axios.delete(requestUrl, config)
        .then((response) => {
          callResponse(response)
        })
        .catch((error) => {
          // console.clear();
          try {
            callError(error)
          } catch (error) {
          }
        })
      break;
  }
}

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
