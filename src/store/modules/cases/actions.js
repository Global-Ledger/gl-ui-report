import apiService from '@/utils/api-client'

export default {
  // eslint-disable-next-line no-unused-vars
  getActiveCases: async function ({commit}, {
    title = undefined,
    from = undefined,
    to = undefined,
    skip = undefined,
    count = undefined
  }) {
    try {
      let data;
      data = apiService.get('tx/visualCases', {params: {from, to, title, archived: false, skip, count}});
      // commit('ADD_HISTORY_ENTRY', { path: `api/tx/visualCases`})
      return data
    } catch (error) {
      console.error(error)
    }
  },
  // eslint-disable-next-line no-unused-vars
  getArchiveCases: async function ({commit}, {
    title = undefined,
    from = undefined,
    to = undefined,
    skip = undefined,
    count = undefined
  }) {
    try {
      let data;
      data = apiService.get('tx/visualCases', {params: {from, to, title, archived: true, skip, count}});
      // commit('ADD_HISTORY_ENTRY', { path: `api/tx/visualCases`})
      return data
    } catch (error) {
      console.error(error)
    }
  },
  // eslint-disable-next-line no-unused-vars
  getCaseById: async function ({commit}, id) {
    try {
      let data;
      data = apiService.get(`tx/visualCase/${id}`);
      // commit('ADD_HISTORY_ENTRY', { path: `api/tx/visualCases`})
      return data
    } catch (error) {
      console.error(error)
    }
  },
  // eslint-disable-next-line no-unused-vars
  async createCase({ commit }, { search, graph, title, image, blockchain }) {
    try {
      const data = apiService.post('tx/visualCase', { search, graph, title, blockchain, image })
        return data
    } catch (error) {
        console.error(error)
    }
  },
  // eslint-disable-next-line no-unused-vars
  async visualCaseUpdates({ commit }, { addresses, mode, caseId }) {
    try {
      const data = apiService.post('tx/visualCaseUpdates', { addresses, mode, caseId })
        return data
    } catch (error) {
        console.error(error)
    }
  },

  // eslint-disable-next-line no-unused-vars
  async deleteCase({ commit }, { caseIds }) {
    try {
      const data = apiService.delete(`tx/visualCase`, { data: { ids: caseIds } })
      return data
    } catch (error) {
      console.error(error)
    }
  },

  editCase(ctx, { id, title, image, graph }) {
    return apiService.patch(`tx/visualCase`, { id, title, image, graph })
  },

  // eslint-disable-next-line no-unused-vars
  casesToArchive({ commit }, { ids, status }) {
    return apiService.put('/tx/visualCase', { ids, status: String(status) })
  },
}
