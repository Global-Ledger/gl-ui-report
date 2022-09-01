# User

# Actions
``` js
login({ commit }, { email, password }) {
    try {
      return apiService.post('users/login', { email, password })
    } catch (error) {
      console.error(error)
    }
}
```
``` js
logout({ commit }) {
    commit('REMOVE_USER_TOKEN')
}
```
``` js
register({ commit }, { email, password, invitationCode }) {
    return apiService.post('users/register', { email, password, invitationCode })
      .then(({ data }) => {
        commit('SET_USER_TOKEN', data)
      })
}
```
``` js
resetPassword({ commit }, { email, password, resetToken }) {
    return apiService.post('users/update-password', { email, password, resetToken })
      .then(({ data }) => {
        commit('SET_USER_TOKEN', data)
      })
}
```
``` js
getMe({ commit }) {
    return apiService.get(`users/me`)
      .then(({ data }) => {
        commit('SET_USER_DATA', data)
      })
}
```
``` js
initToken({ commit }) {
    const token = localStorage.getItem('token')
    if (token) commit('SET_USER_TOKEN', { token })
    return token;
}
```
# Mutations
``` js
SET_USER_TOKEN(state, { token }) {
    state.token = token
    localStorage.setItem('token', token)
},
REMOVE_USER_TOKEN(state) {
    state.token = null
    localStorage.removeItem('token')
},
SET_USER_DATA(state, data) {
    state.userData = data
}
```
# State
``` js
token: null
id: null
userData: {}
```
# Getters
``` js
userRole: (state) => state.userData.role || null,
isAdmin: (state) => state.userData.role && state.userData.role === 'admin',
```