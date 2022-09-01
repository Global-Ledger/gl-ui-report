import axios from 'axios'
import Vue from 'vue'
import store from '@/store'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers['Authorization'] = `Bearer ${ token }`
  return config
}, error => error)

apiClient.interceptors.response.use(res => {
  if (res.data && !res.data.status && res.data.data === null) {
    Vue.toasted.global.error({ message: 'API REQUEST ERROR' })
    throw new Error('API REQUEST ERROR')
  }
  return res.data
}, error => {
  if (error.response.status === 403) {
    localStorage.removeItem('token')
    if (error.response.data.message === 'jwt expired') {
      store.dispatch('user/resetToken', { refreshToken: localStorage.getItem('refreshToken') })
          .finally(() => {
            window.location.assign('/')
          })
    } else window.location.assign('/')
  }

  if (error.response.status === 401) {
    localStorage.removeItem('token')
    window.location.assign('/')
  }
  Vue.toasted.global.error({ message: error.response.data.message })
  throw error
})

export default apiClient
