import { createRouter, createWebHistory } from 'vue-router'
import Layout from './components/Layout.vue'
import Dashboard from './views/Dashboard.vue'
import Products from './views/Products.vue'
import Orders from './views/Orders.vue'
import DataCenter from './views/DataCenter.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', name: 'Dashboard', component: Dashboard },
        { path: 'products', name: 'Products', component: Products },
        { path: 'orders', name: 'Orders', component: Orders },
        { path: 'data', name: 'DataCenter', component: DataCenter },
      ]
    }
  ]
})
