import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import router from './router/index'
import store from './store'
import dateFilter from './filters/date.filter'
import currencyFilter from './filters/currency.filter'
import localeFilter from './filters/localize.filter'
import messagePlugin from './utils/message.plugin'
import toolTipDirective from './directives/tooltip.directive'
import Loader from './components/app/Loader'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Paginate from 'vuejs-paginate'


Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.filter('date', dateFilter);
Vue.filter('currency', currencyFilter);
Vue.filter('localize', localeFilter);
Vue.directive('tooltip', toolTipDirective)
Vue.component('Loader', Loader);
Vue.component('Paginate', Paginate);

const firebaseConfig = {
  apiKey: "AIzaSyAWcJPMt_Vj2sxkdij37bDk_SAzc6VXpk0",
  authDomain: "vue-crm-df46b.firebaseapp.com",
  projectId: "vue-crm-df46b",
  storageBucket: "vue-crm-df46b.appspot.com",
  messagingSenderId: "389097496790",
  appId: "1:389097496790:web:d5b876784269edc2f3e977"
};

let app;

firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app =new Vue({
      router,
      store,
      render: (h) => h(App)
    }).$mount(`#app`);
  }

});


