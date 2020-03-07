import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import toast from 'components/common/toast'
import FastClick from 'fastclick'
import Lazyload from "vue-lazyload";
Vue.config.productionTip = false
//添加事件总线对象
Vue.prototype.$bus=new Vue()
//安装toast
Vue.use(toast)
Vue.use(Lazyload,{
  loading:require('assets/img/common/lazy.jpg')
})

FastClick.attach(document.body)
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
