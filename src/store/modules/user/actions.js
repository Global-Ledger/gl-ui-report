import apiService from '@/utils/api-client'

export default {
  // eslint-disable-next-line no-unused-vars
  login({ commit }, { email, password }) {
    try {
      return apiService.post('users/login', { email, password })
    } catch (error) {
      console.error(error)
    }
  },
    // eslint-disable-next-line no-unused-vars
    setScoringFormula({ commit }, { scoringFormula }) {
    try {
      return apiService.post('users/scoring-formula', { scoringFormula })
    } catch (error) {
      console.error(error)
    }
  },
  logout({ commit }) {
    commit('REMOVE_USER_TOKEN')
    commit('REMOVE_USER_ID')
  },
  register({ commit }, { email, password, invitationCode }) {
      try {
          return apiService.post('users/register', { email, password, invitationCode })
              .then(({ data }) => {
                  commit('SET_USER_TOKEN', data)
                  commit('SET_USER_ID', data) })
      } catch (error) {
          console.error(error)
      }
  },
  resetPassword({ commit }, { email, password, resetToken }) {
    return apiService.post('users/update-password', { email, password, resetToken })
      .then(({ data }) => {
        commit('SET_USER_TOKEN', data)
        commit('SET_USER_ID', data) })
  },
  getMe({ commit }) {
    return apiService.get(`users/me`)
      .then(({ data }) => {
        commit('SET_USER_DATA', data)}).catch((err) => {
        console.log(err)
      })
  },
  resetToken({ commit }, { refreshToken }) {
    return apiService.get(`users/reset-token/${refreshToken}`)
        .then(({ data }) => {
          console.log(data, refreshToken)
          commit('SET_USER_TOKEN', data)
          commit('SET_USER_REFRESH_TOKEN', data)
          commit('SET_USER_ID', data) }).catch((err) => {
            console.log(err)
        })
  },
  initToken({ commit }) {
    const token = localStorage.getItem('token')
    if (token) commit('SET_USER_TOKEN', { token })
    return token;
  },
}
