const getters = {
    userRole: (state) => state.userData.role || null,
    isAdmin: (state) => state.userData.role && state.userData.role === 'admin',
}

export default getters