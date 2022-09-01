import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
//plugins
import Toasted from 'vue-toasted'
import Tooltip from 'vue-directive-tooltip'
import VueSkeletonLoader from 'skeleton-loader-vue';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import VueTheMask from 'vue-the-mask';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
//utils
import './utils/validation-rules'
//styles
import './assets/styles/main.css'
import {Table, Switch, Pagination} from "@oruga-ui/oruga"
import '@oruga-ui/oruga/dist/oruga.css'
import '@oruga-ui/oruga/dist/oruga-full-vars.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

// CASL
import { abilitiesPlugin } from '@casl/vue';
import defineAbilityFor from './services/defineAbilityFor';

Vue.component('v-select', vSelect)
Vue.component('DatePicker', DatePicker)
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker)

Vue.component('vue-skeleton-loader', VueSkeletonLoader);

Vue.use(Table)
Vue.use(Pagination)
Vue.use(VueCtkDateTimePicker)
Vue.use(Switch)
Vue.use(VueTheMask)

Vue.use(abilitiesPlugin, defineAbilityFor(), {
    useGlobalProperties: true
})

Vue.use(Toasted, {
  position: 'top-right',
  duration: 2000,
	keepOnHover: true,
	closeOnSwipe: true,
	iconPack : 'material',
})
const toastTypes = ['error', 'success', 'info']

Vue.use(Tooltip, {
  delay: 0,
  placement: 'right',
  class: 'gl-tooltip',
  triggers: ['hover'],
  offset: 10,
})

toastTypes.forEach(type => {
  Vue.toasted.register(
    type,
    ({ message }) => message || '',
    {
      type,
      className: `gl-toast gl-toast--${ type }`,
      icon: type !== 'success' ? null : 'check_circle_outline'
    })
})


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
