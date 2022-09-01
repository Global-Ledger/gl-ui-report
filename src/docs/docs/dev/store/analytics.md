# Analytics

# Actions
``` js
getTransactionInfo({ commit }, txHash) {
  try {
      const data = apiService.get(`tx/txBrowser/${ txHash }`)
      return data
  } catch (error) {
    console.error(error)
  }
}
```
``` js
getTransactionData({ commit }, address) {
  try {
    const data = apiService.get(`tx/getAddressTxsStats/${ address }`)
    return data
  } catch (error) {
    console.error(error)
  }
}
```
``` js
getNewAddressInfo({ commit }, {
    address,
    currentDate = undefined,
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
      }})
      return data
    } catch (error) {
      console.error(error)
    }
},
```
``` js
getAddressHistory({ commit }, { address, page }) {
    try {
        const data = apiService.get(`tx/address-history/${ address }`, { params: { page } })
        return data
    } catch (error) {
        console.error(error)
    }
}
```
``` js
getClusterHistory({ commit }, { cluster, page }) {
    try {
        const data = apiService.get(`tx/cluster-history/${ cluster }`, { params: { page } })
        return data
    } catch (error) {
        console.error(error)
    }
}
```
``` js
getTxStats({ commit }, txHash) {
    try {
        const data = apiService.get(`tx/getTxStats/${ txHash }`)
        return data
    } catch (error) {
        console.error(error)
    }
}
```
``` js
getAddressData({ commit }, address) {
    try {
      const data = await apiService.get(`tx/getAddressInfo/${ address }`)
      return data
    } catch (error) {
      console.error(error)
    }
}
```
# Mutations
``` js
SET_VALIDATE_HASH(state, data) {
    state.isHash = data
},
SET_VALIDATE_ADDRESS(state, data) {
    state.isAddress = data
},
SET_SEARCH_VALUE(state, data) {
    state.searchValue = data
}}
```
# State
``` js
isHash: false,
isAddress: false,
searchValue: null,
```