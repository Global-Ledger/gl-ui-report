import apiService from '@/utils/api-client'
import store from '@/store'

export default {
    async getInputClusterSource({ commit }, { cluster, from = undefined, to = undefined }) {
        try {
            const data = apiService.get(`/tx/getInputClusterSource`, { params: { cluster, from, to } })
            commit('ADD_HISTORY_ENTRY', { path: `/tx/getInputClusterSource`, params: { cluster, from, to } })
            return data
        } catch (error) {
            console.error(error)
        }
    },
    async getOutputClusterSource({ commit }, { cluster, from = undefined, to = undefined }) {
        try {
            const data = apiService.get(`/tx/getOutputClusterSource`, { params: { cluster, from, to } })
            commit('ADD_HISTORY_ENTRY', { path: `/tx/getOutputClusterSource`, params: { cluster, from, to } })
            return data
        } catch (error) {
            console.error(error)
        }
    },
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
    async getAddressTokens({ commit }, address) {
        try {
            const data = apiService.get(`ethVision/getAddressTokens/${ address }`)
            commit('ADD_HISTORY_ENTRY', { path: `api/tx/getAddressTokens/${ address }` })
            return data
        } catch (error) {
            console.error(error)
        }
    },
    async getAddressBalance({ commit }, { address, contract }) {
        try {
            const data = apiService.get(`ethVision/getBalance/${ address }`, { params: {
                contract,
            }})
            commit('ADD_HISTORY_ENTRY', { path: `api/tx/getBalance/${ address }` })
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
    async getEthAddressData({ commit }, {
        address,
        contract = undefined,
        startRangeDate = undefined,
        endRangeDate = undefined,
        page = 1,
        count = 10,
        sort = -1,
    }) {
        try {
            const data = await apiService.get(`ethVision/addressBrowser/${ address }`, { params: {
                    startRangeDate,
                    endRangeDate,
                    contract,
                    page,
                    count,
                    sort,
                }})
            commit('ADD_HISTORY_ENTRY', { path: `ethVision/addressBrowser/${ address }`, params: { address } })
            return data
        } catch (error) {
            console.error(error)
        }
    },
    async getTransactionInfoIO({ commit }, { txHash, only = undefined, inputsPerPage = 10, outputsPerPage = 10, inputsSkip = 0, outputsSkip = 0 }) {
    try {
      const data = apiService.get(`tx/txBrowserIO/${ txHash }`, { params: {
          only,
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
    async getAddressBrowserDetails({ commit }, { tx, inputsPerPage = 10, outputsPerPage = 10, inputsSkip = 0, outputsSkip = 0, address }) {
        try {
            const data = await apiService.get(`tx/addressBrowserDetails/${ tx }`, { params: {
                inputsPerPage,
                outputsPerPage,
                inputsSkip,
                outputsSkip,
                address,
            } })
            commit('ADD_HISTORY_ENTRY', { path: `api/tx/addressBrowserDetails/${ tx }`, params: { tx } })
            return data
        } catch (error) {
            console.error(error)
        }
    },
    async getAddressBrowserList({ commit }, {
        address,
        currentDate = undefined,
        startRangeDate = undefined,
        endRangeDate = undefined,
        sort = undefined,
        page = 1,
        count = 5,
    }) {
        try {
            const data = await apiService.get(`tx/addressBrowserNew/${ address }`, { params: {
                    startRangeDate,
                    endRangeDate,
                    currentDate,
                    sort,
                    page,
                    count,
                }})
            commit('ADD_HISTORY_ENTRY', { path: `api/tx/addressBrowser/${ address }`, params: { address} })
            return data
        } catch (error) {
            console.error(error)
        }
    },
  async getNewAddressInfo({ commit }, {
    address,
    currentDate = undefined,
    page = 1,
    count = 5,
    startRangeDate = undefined,
    endRangeDate = undefined,
    sort = undefined,
  }) {
    try {
      const data = await apiService.get(`tx/addressBrowser/${ address }`, { params: {
          startRangeDate,
          endRangeDate,
          currentDate,
          sort,
          page,
          count,
      }})
      commit('ADD_HISTORY_ENTRY', { path: `api/tx/addressBrowser/${ address }`, params: { address} })
      return data
    } catch (error) {
      console.error(error)
    }
  },
	async getTransactionData({ commit }, address) {
		try {
			const data = apiService.get(`tx/getAddressTxsStats/${ address }`)
			commit('ADD_HISTORY_ENTRY', { path: `api/tx/getTransactionInfo/${ address }`, params: { address } })
			return data
		} catch (error) {
			console.error(error)
		}
	},
    async getAddressHistory({ commit }, { address, page }) {
        const coin = store.state.analytics.coinType || 'tx'
		try {
			const data = apiService.get(`${coin}/address-history/${ address }`, { params: { page } })
			commit('ADD_HISTORY_ENTRY', { path: `api/tx/getTransactionInfo/${ address }`, params: { address } })
			return data
		} catch (error) {
			console.error(error)
		}
	},
    async getClusterHistory({ commit }, { cluster, page }) {
		try {
			const data = apiService.get(`tx/cluster-history/${ cluster }`, { params: { page } })
			commit('ADD_HISTORY_ENTRY', { path: `api/tx/getTransactionInfo/${ cluster }`, params: { cluster } })
			return data
		} catch (error) {
			console.error(error)
		}
	},
	async getTxStats({ commit }, txHash) {
		try {
			const data = apiService.get(`tx/getTxStats/${ txHash }`)
			commit('ADD_HISTORY_ENTRY', { path: `api/tx/getTxStats/${ txHash }`, params: { txHash } })
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
    async getEthAddressInfo({ commit }, address) {
    try {
      const data = await apiService.get(`ethVision/getAddressInfo/${ address }`)
      commit('ADD_HISTORY_ENTRY', { path: `api/ethVision/getAddressInfo/${ address }`, params: { address } })
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
  async getTransactionRisk({ commit }, txHash) {
    try {
      const data = await apiService.get(`calculation/txScore/${ txHash }`)
      commit('ADD_HISTORY_ENTRY', { path: `api/calculation/txScore/${ txHash }`, params: { txHash } })
      return data
    } catch (error) {
      console.error(error)
    }
  },
  async getAddressRisk({ commit }, address) {
    try {
      const data = await apiService.get(`calculation/addressScore/${ address }`)
      commit('ADD_HISTORY_ENTRY', { path: `api/calculation/addressScore/${ address }`, params: { address } })
      return data
    } catch (error) {
      console.error(error)
    }
  },
  async getTxIntersection({ commit }, value) {
    console.log(typeof value)
    try {
        const data = await apiService.get(`calculation/txsCrossingInvestigation?${value ? value.map((n) => `txsArray=${n}`).join('&') : ''}`)
        commit('ADD_HISTORY_ENTRY', { path: `api/calculation/txsCrossingInvestigation/${ value }`, params: { value } })
        return data
    } catch (error) {
        console.error(error)
    }
  },
  async getHistory({ commit }, count = 20) {
    const data = await apiService.get('tx/history', { params: { count } })
    commit('SET_HISTORY', data)
  },
  async checkSources({ commit }, { outTxHash, sourceTxHash }) {
    try {
      const data = await apiService.get(`tx/checkSources/${ outTxHash }/${ sourceTxHash }`)
      commit('ADD_HISTORY_ENTRY', {
        path: `api/tx/checkSources/${ outTxHash }/${ sourceTxHash }`,
        params: { hashes: [outTxHash, sourceTxHash] },
      })
      return data
    } catch (error) {
      console.error(error)
    }
  },
  async calculationAddressRisk({ commit }, address) {
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
    async getClusterTags({ commit }, { cluster, count = 5, skip = 0 }) {
        try {
            const data = apiService.get(`tx/clusterTagsList/${cluster}`, { params: { cluster, count, skip  } })
            return data
        } catch (error) {
            console.error(error)
        }
    },

    // eslint-disable-next-line no-unused-vars
    async getClusterAddresses({ commit }, { cluster, limit = 5, skip = 0, sortField, sortDirection }) {
        try {
            const data = apiService.get(`tx/clusterAddresses/${cluster}`, { params: { cluster, limit, skip, sortField, sortDirection  } })
            return data
        } catch (error) {
            console.error(error)
        }
    },
    // eslint-disable-next-line no-unused-vars
    async getRiskAddressHistoryList({ commit }, { count = 5, skip = 0 }) {
        try {
            const data = apiService.get(`calculation/risk-address-history-list`, { params: { count, skip } })
            return data
        } catch (error) {
            console.error(error)
        }
    },
    // eslint-disable-next-line no-unused-vars
    async getRiskTxHistoryList({ commit }, { count = 5, skip = 0 }) {
        try {
            const data = apiService.get(`calculation/risk-tx-history-list`, { params: { count, skip } })
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
    // eslint-disable-next-line no-unused-vars
    async getPrevNextData({ commit }, { nextTx, prevTx }) {
        try {
            const data = apiService.post('/ethVision/addressPrevNext', { nextTx, prevTx })
            return data
        } catch (error) {
            console.error(error)
        }
    },
}
