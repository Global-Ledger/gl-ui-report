import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import analytics from './modules/analytics'
import users from './modules/users'
import tagging from './modules/tagging'
import sidebar from './modules/sidebar'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    users,
    tagging,
    sidebar,
    analytics
  },
})
