export default {
  SET_USER_TOKEN(state, { token }) {
    state.token = token
    localStorage.setItem('token', token)
  },
  SET_USER_REFRESH_TOKEN(state, { refreshToken }) {
    state.refreshToken = refreshToken
    localStorage.setItem('refreshToken', refreshToken)
  },
  SET_USER_ID(state, { id }) {
    state.id = id
    localStorage.setItem('id', id)
  },
  REMOVE_USER_TOKEN(state) {
    state.token = null
    localStorage.removeItem('token')
  },
  REMOVE_USER_ID(state) {
    state.id = null
    localStorage.removeItem('id')
  },
  SET_USER_DATA(state, data) {
    state.userData = data
  },
}
