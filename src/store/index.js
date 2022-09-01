import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import analytics from './modules/analytics'
import users from './modules/users'
import tagging from './modules/tagging'
import statistics from './modules/statistics'
import types from './modules/types'
import sidebar from './modules/sidebar'
import cases from './modules/cases'
import monitoring from './modules/monitoring'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    users,
    tagging,
    statistics,
    sidebar,
    types,
    cases,
    monitoring,
    analytics
  },
})
