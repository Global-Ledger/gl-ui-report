import apiService from '@/utils/api-client'
import store from '@/store'

export default {
  // eslint-disable-next-line no-unused-vars
  async getAddressTags({ commit }, address) {
    const coin = store.state.analytics.coinType || 'tx'
    try {
      const data = apiService.get(`${coin}/getAddressTags/${ address }`)
      return data
    } catch (error) {
      console.error(error)
    }
  },
}
