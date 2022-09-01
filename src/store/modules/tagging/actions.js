import apiService from '@/utils/api-client'
import { sendFormatter } from "@/utils/text-formatter";
import store from '@/store'

export default {
	// eslint-disable-next-line no-unused-vars
  updateWallet({ commit }, data) {
    const coin = store.state.analytics.coinType || 'tx'
    return apiService.put(`/${coin}/update-wallet`, data)
  },
	// eslint-disable-next-line no-unused-vars
  updateCluster({ commit }, data) {
    return apiService.put('/tx/update-cluster', data)
  },

  // eslint-disable-next-line no-unused-vars
  async getUploadConflicts({ commit }, { type, count, skip, address = undefined, cluster = undefined, from = undefined, to = undefined }) {
    try {
      const data = apiService.get(`tx/getUploadConflicts`, { params: { type, count, skip, address, cluster, to, from } })
      return data
    } catch (error) {
      console.error(error)
    }
  },
  // eslint-disable-next-line no-unused-vars
  async getConflictsTotal({ commit }, { type }) {
    try {
      const data = apiService.get(`tx/getConflictsTotal`, { params: { type } })
      return data
    } catch (error) {
      console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async resolveConflict({ commit }, { type, id, index }) {
    try {
      const data = apiService.post('tx/resolveConflict', { type, id, index })
      return data
    } catch (error) {
      console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async deleteConflict({ commit }, { type, id, index }) {
    try {
      const data = apiService.delete(`tx/deleteConflict`, { data: { type, id, index } })
      return data
    } catch (error) {
      console.error(error)
    }
  },

  // FOR LABELING
  // eslint-disable-next-line no-unused-vars
  async getTags({ commit }, { name, sortField, count, skip, sortOrder, search } ) {
    const coin = store.state.analytics.coinType || 'tx'

    try {
      const data = apiService.get(`${coin}/getTags`, { params: { name, sortField, count, skip, sortOrder, search } })
      return data
    } catch (error) {
      console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async getClusterInfo({ commit }, clusterId) {
    try {
      const data = apiService.get(`tx/getClusterInfo/${clusterId}`)
      return data
    } catch (error) {
      console.error(error)
    }
  },

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

  async getClusterConflicts() {
    try {
      const data = apiService.get(`tx/mergedClusterInfo`)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async resolveClusterConflicts({ commit }, cluster) {
    try {
      const data = apiService.get(`tx/resolveMergedCluster/${cluster}`)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  async generateClusterInfo() {
    try {
      const data = apiService.get(`tx/generateClusterInfo`)
      return data
    } catch (error) {
      console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async addTag({ commit }, { name, score, metadata }) {
    const coin = store.state.analytics.coinType || 'tx'
    const formattedName = sendFormatter(name)

    try {
      return apiService.post(`${coin}/addTag`, { name: formattedName, score, metadata })
    } catch (error) {
      console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async addAddressTag({ commit }, { name, address }) {
    const formattedName = sendFormatter(name)
    const coin = store.state.analytics.coinType || 'tx'

    try {
      return apiService.post(`${coin}/addAddressTag`, { name: formattedName, address })
    } catch (error) {
      console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async editTag({ commit }, { name, newName, score, metadata }) {
    const formattedName = sendFormatter(name)
    const formattedNewName = sendFormatter(newName)
    const coin = store.state.analytics.coinType || 'tx'

    try {
      return apiService.post(`${coin}/editTag`, { name: formattedName, newName: formattedNewName, score, metadata })
    } catch (error) {
      console.error(error)
    }
  },

  deleteTag(ctx, { names }) {
    const formattedNames = names.map(name => sendFormatter(name))
    const coin = store.state.analytics.coinType || 'tx'

    return apiService.delete(`${coin}/deleteTag`, { data: { names: formattedNames } });
  },

  deleteAddressTag(ctx, { name, address }) {
    const formattedName = sendFormatter(name)
    const coin = store.state.analytics.coinType || 'tx'

    return apiService.delete(`${coin}/deleteAddressTag/${address}/${formattedName}`)
  },

  deleteClusterTag(ctx, { name, address }) {
    const coin = store.state.analytics.coinType || 'tx'
    const formattedName = sendFormatter(name)

    return apiService.delete(`${coin}/deleteClusterTag/${address}/${formattedName}`)
  },
}
