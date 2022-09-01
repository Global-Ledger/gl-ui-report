import apiService from '@/utils/api-client'

export default {
  // eslint-disable-next-line no-unused-vars
  async getAddressesMonitoring({ commit }, { skip = 0, count = 10, address = '' }) {
    try {
      const data = apiService.get('monitor/addressToMonitor', { params: { skip, count, address } })
      // commit('ADD_HISTORY_ENTRY', { path: `api/tx/visualCases`})
      return data
    } catch (error) {
      console.error(error)
    }
  },
  // eslint-disable-next-line no-unused-vars
  async getAddressesUserScore({ commit }, { address }) {
    try {
      const data = apiService.get(`calculation/addressUserScore/${address}`, { params: { address } })
      // commit('ADD_HISTORY_ENTRY', { path: `api/tx/visualCases`})
      return data
    } catch (error) {
      console.error(error)
    }
  },
  // eslint-disable-next-line no-unused-vars
  async addToMonitoring({ commit }, { address, file, checkLastTen }) {
    try {
      const data = apiService.post('monitor/addressToMonitor', { address, file, checkLastTen, blockchain: 'BTC' })
        return data
    } catch (error) {
        console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async deleteAddressFromMonitoring({ commit }, { address }) {
    try {
      const data = apiService.delete(`monitor/addressToMonitor/${address}`)
      return data
    } catch (error) {
      console.error(error)
    }
  },
}
