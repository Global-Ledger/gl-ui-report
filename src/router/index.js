import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    redirect: { name: 'report' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../pages/login'),
    meta: {
      title: 'Login'
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "login" */ '../pages/register'),
    meta: {
      title: 'Register'
    },
  },
  {
    path: '/report',
    name: 'report',
    component: () => import(/* webpackChunkName: "analytics" */ '../pages/report'),
    meta: {
      requiresAuth: true,
      title: 'Report'
    },
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../pages/404'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.name === 'login') {
    const token = await store.dispatch('user/initToken')
    if (token) {
      next({ name: 'report' })
      return
    }
  }

  if (to.name === 'register') {
    await store.dispatch('user/logout')
    next()
    return
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = await store.dispatch('user/initToken')
    if (!token) {
      next({ name: 'login' })
      return
    }
    await store.dispatch('user/getMe')
  }

  next()
})

router.afterEach((to, /* from */) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || 'gl-front-vision'
  })
})

export default router
