import apiService from '@/utils/api-client'

export default {
  async getTransactionInfo({ commit }, {
      txHash,
      isAddress = false,
      only = undefined,
      inputsPerPage = only ===  'outputs' ? 1000: 10,
      outputsPerPage = only ===  'inputs' ? 1000: 10,
      inputsSkip = 0,
      outputsSkip = 0
  }) {
    try {
      const data = apiService.get(`tx/txBrowserIO/${ txHash }`, { params: {
          only,
          isAddress,
          inputsPerPage,
          outputsPerPage,
          inputsSkip,
          outputsSkip,
      } })
      commit('ADD_HISTORY_ENTRY', { path: `api/tx/txBrowser/${ txHash }`, params: { txHash } })
      return data
    } catch (error) {
      console.error(error)
    }
  },
    async getTxEthData({ commit, state }, {
        tx,
        currentDate = undefined,
        contract = undefined,
        startRangeDate = undefined,
        endRangeDate = undefined,
        sort = undefined,
    }) {
        try {
            const data = await apiService.get(`${state.coinType}/txBrowser/${ tx }`, { params: {
                    startRangeDate,
                    endRangeDate,
                    contract,
                    currentDate,
                    sort,
                }})
            commit('ADD_HISTORY_ENTRY', { path: `ethVision/txBrowser/${ tx }`, params: { tx} })
            return data
        } catch (error) {
            console.error(error)
        }
    },
    async getTxEthScore({ commit, state }, {
        tx,
    }) {
        try {
            const data = await apiService.get(`${state.coinType}/txScore/${ tx }`)
            commit('ADD_HISTORY_ENTRY', { path: `ethVision/txScore/${ tx }`, params: { tx } })
            return data
        } catch (error) {
            console.error(error)
        }
    },
	async getAddressData({ commit }, address) {
    try {
      const data = await apiService.get(`tx/getAddressInfo/${ address }`)
      commit('ADD_HISTORY_ENTRY', { path: `api/tx/getAddressInfo/${ address }`, params: { address } })
      return data
    } catch (error) {
      console.error(error)
    }
  },
    async getTransactionRisk2({ commit }, txHash) {
        try {
            const data = await apiService.get(`calculation/txScore/${ txHash }`)
            commit('ADD_HISTORY_ENTRY', { path: `api/calculation/txScore/${ txHash }`, params: { txHash } })
            return data
        } catch (error) {
            console.error(error)
        }
    },
    async getAddressRisk2({ commit }, address) {
        try {
            const data = await apiService.get(`calculation/addressScore/${ address }`)
            commit('ADD_HISTORY_ENTRY', { path: `api/calculation/addressScore/${ address }`, params: { address } })
            return data
        } catch (error) {
            console.error(error)
        }
    },

    // eslint-disable-next-line no-unused-vars
    async getAddressTags({ commit }, { address, count = 5, skip = 0 }) {
        try {
            const data = apiService.get(`tx/addressTagsList/${address}`, { params: { address, count, skip  } })
            return data
        } catch (error) {
            console.error(error)
        }
    },
    // eslint-disable-next-line no-unused-vars
    async getTxAMLInfo({ commit }, { tx_hash }) {
        try {
            const data = apiService.get(`tx/txAMLInfo/${tx_hash}`)
            return data
        } catch (error) {
            console.error(error)
        }
    },
}
