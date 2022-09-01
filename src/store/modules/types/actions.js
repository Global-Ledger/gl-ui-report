import apiService from '@/utils/api-client'
import { sendFormatter } from "@/utils/text-formatter";
import store from '@/store'

export default {
  // eslint-disable-next-line no-unused-vars
  async getTypes({ commit }, { name, sortField, count, skip, sortOrder, search }) {
    const coin = store.state.analytics.coinType || 'tx'
    try {
      const data = apiService.get(`${coin}/getTypes`, { params: { name, sortField, count, skip, sortOrder, search } })
      return data
    } catch (error) {
      console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async addType({ commit }, { name, score }) {
    const formattedName = sendFormatter(name)
    const coin = store.state.analytics.coinType || 'tx'

    try {
      return apiService.post(`${coin}/addType`, { name: formattedName, score })
    } catch (error) {
      console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async mergeTypes({ commit }, { toType, fromTypes, score }) {
    const coin = store.state.analytics.coinType || 'tx'
    const formattedToType = sendFormatter(toType)
    const formattedFromType = fromTypes.map(type => sendFormatter(type))

    try {
      return apiService.post(`${coin}/mergeTypes`, { toType: formattedToType, fromTypes: formattedFromType, score })
    } catch (error) {
      console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async editType({ commit }, { name, newName, score }) {
    const coin = store.state.analytics.coinType || 'tx'
    const formattedName = sendFormatter(name)
    const formattedNewName = sendFormatter(newName)

    try {
      return apiService.post(`${coin}/editType`, { name: formattedName, newName: formattedNewName, score })
    } catch (error) {
      console.error(error)
    }
  },

  deleteType(ctx, { names }) {
    const formattedNames = names.map(name => sendFormatter(name))
    const coin = store.state.analytics.coinType || 'tx'

    return apiService.delete(`${coin}/deleteType`, { data: { names: formattedNames } });
  },
}
