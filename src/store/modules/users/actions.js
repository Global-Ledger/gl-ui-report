import apiService from '@/utils/api-client'

export default {
	// eslint-disable-next-line no-unused-vars
  getUsersList({ commit }, { count, skip }) {
    return apiService.get('admin/users-list', { params: { count, skip } })
  },
  // eslint-disable-next-line no-unused-vars
  setActiveUser({ commit }, data) {
    return apiService.put('admin/set-active-status', data)
  },
  // eslint-disable-next-line no-unused-vars
  getUser({ commit }, id) {
    return apiService.get(`admin/users/${id}`)
  },
  editUser(ctx, { id, body }) {
    return apiService.patch(`admin/users/${id}`, body)
  },
  deleteUser(ctx, id) {
    return apiService.delete(`admin/users/${id}`)
  },
	// eslint-disable-next-line no-unused-vars
	sendInviteUser({ commit }, { email, role, activeTo = null }) {
    return apiService.post('admin/send-invitation', { email, role, activeTo })
  },
	// eslint-disable-next-line no-unused-vars
	resetPassword({ commit }, email) {
    return apiService.get(`users/reset-password/${email}`)
  },
}
