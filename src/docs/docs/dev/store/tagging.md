# Tagging

# Actions

``` js
updateWallet({ commit }, data) {
    return apiService.put('/tx/update-wallet', data)
}
```

``` js
updateCluster({ commit }, data) {
    return apiService.put('/tx/update-cluster', data)
}
```