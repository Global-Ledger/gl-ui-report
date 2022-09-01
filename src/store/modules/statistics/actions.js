import apiService from '@/utils/api-client'

export default {
  // eslint-disable-next-line no-unused-vars
  async getClustersStatisticsInfo({ commit }, { entity, type,tag, risk, addresses, sortField, count, skip, sortOrder, owner, from, to }) {
    try {
      const data = apiService.get('/tx/getExistingClusters', { params: { entity, tag, type, risk, addresses, sortField, count, skip, sortOrder, owner, from, to } })
      // commit('ADD_HISTORY_ENTRY', { path: 'get-cluster-statistics'})
      return data
    } catch (error) {
      console.error(error)
    }
  },
  // eslint-disable-next-line no-unused-vars
  async getAddressStatisticsInfo({ commit }, { address, cluster,tag, description, type, risk, sortField, count, skip, sortOrder, owner, from, to }) {
    try {
      const data = apiService.get('/tx/getExistingAddresses', { params: { address,tag, cluster, type, risk, description, sortField, from, to, count, skip, sortOrder, owner } })
      return data
    } catch (error) {
      console.error(error)
    }
  },
  // eslint-disable-next-line no-unused-vars
  async getTotalAddresses({ commit }, { address, cluster, description, type, risk, owner, from, to, tag }) {
    try {
      const data = apiService.get('/tx/getTotalAddresses', { params: { address, cluster, type, risk, description, owner, from, to, tag } })
      return data
    } catch (error) {
      console.error(error)
    }
  },
  // eslint-disable-next-line no-unused-vars
  async getTagStats({ commit }) {
    try {
      const data = apiService.get('/tx/getTagStats')
      return data
    } catch (error) {
      console.error(error)
    }
  },
  async generateTagStats({ commit }) {
    try {
      const data = apiService.get('/tx/generateTagStats')
      commit('ADD_HISTORY_ENTRY', { path: 'generateTagStats'})
      return data
    } catch (error) {
      console.error(error)
    }
  },
}
