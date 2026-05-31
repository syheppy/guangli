import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import ProductList from '../views/ProductList.vue'
import Orders from '../views/Orders.vue'
import Analytics from '../views/Analytics.vue'
import BannersView from '../views/BannersView.vue'
import PopupView from '../views/PopupView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuth } from '../composables/useAuth.js'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'products',
        name: 'ProductList',
        component: ProductList,
      },
      {
        path: 'orders',
        name: 'Orders',
        component: Orders,
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: Analytics,
      },
      {
        path: 'banners',
        name: 'Banners',
        component: BannersView,
      },
      {
        path: 'popup',
        name: 'Popup',
        component: PopupView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const { isLoggedIn, loading } = useAuth()

  // 等待 session 恢复完成
  if (loading.value) {
    await new Promise(resolve => {
      const unwatch = setInterval(() => {
        if (!loading.value) {
          clearInterval(unwatch)
          resolve()
        }
      }, 50)
    })
  }

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn.value) {
    next('/')
  } else {
    next()
  }
})

export default router
