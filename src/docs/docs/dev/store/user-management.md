# Users

# Actions

``` js
getUsersList({ commit }, { count, skip }) {
    return apiService.get('admin/users-list', { params: { count, skip } })
}
```

``` js
getUser({ commit }, id) {
    return apiService.get(`admin/users/${id}`)
}
```

``` js
deleteUser(ctx, id) {
    return apiService.delete(`admin/users/${id}`)
}
```

``` js
sendInviteUser({ commit }, { email, role }) {
    return apiService.post('admin/send-invitation', { email, role })
}
```

``` js
resetPassword({ commit }, email) {
    return apiService.get(`users/reset-password/${email}`)
}
```