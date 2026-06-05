<template>
  <div class="bg-background text-on-background antialiased h-screen overflow-hidden flex font-[Hanken_Grotesk]">
    <!-- Sidebar -->
    <nav class="h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest shadow-sm flex flex-col py-6 px-4 z-20">
      <div class="mb-8 px-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[20px] font-semibold">
          薯
        </div>
        <div>
          <h1 class="text-[24px] font-bold tracking-tight text-primary">薯鲜生</h1>
          <p class="text-[12px] tracking-wide text-on-surface-variant">管理后台</p>
        </div>
      </div>
      <ul class="flex flex-col gap-2 flex-1">
        <li v-for="item in menuItems" :key="item.label">
          <router-link
            :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out"
            :class="item.active
              ? 'text-primary font-bold bg-primary-fixed'
              : 'text-secondary hover:text-primary hover:bg-surface-container-low'"
          >
            <span
              class="material-symbols-outlined"
              :style="item.active ? 'font-variation-settings: \'FILL\' 1' : ''"
            >{{ item.icon }}</span>
            <span class="text-[16px]">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Main Area -->
    <div class="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
      <!-- Top Bar -->
      <header class="h-16 w-full sticky top-0 z-10 bg-background flex justify-between items-center px-10">
        <div class="flex items-center gap-4">
          <h2 class="text-[24px] font-semibold tracking-tight text-on-surface">{{ pageTitle }}</h2>
        </div>
        <div class="flex items-center gap-6">
          <span class="text-[13px] text-on-surface-variant">{{ user?.email }}</span>
          <button
            @click="handleLogout"
            class="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors"
          >
            <span class="material-symbols-outlined">logout</span>
            <span class="text-[12px] tracking-wide">退出登录</span>
          </button>
          <div class="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
            <svg class="w-full h-full" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="12" r="6" fill="#dbc1b5"/>
              <ellipse cx="16" cy="28" rx="10" ry="8" fill="#dbc1b5"/>
            </svg>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-10">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const route = useRoute()
const router = useRouter()
const { user, signOut } = useAuth()

async function handleLogout() {
  await signOut()
  router.push('/login')
}

const menuItems = computed(() => [
  { label: '工作台', icon: 'dashboard', to: '/', active: route.path === '/' },
  { label: '商品管理', icon: 'inventory_2', to: '/products', active: route.path.startsWith('/products') },
  { label: '订单处理', icon: 'receipt_long', to: '/orders', active: route.path.startsWith('/orders') },
  { label: '数据中心', icon: 'analytics', to: '/analytics', active: route.path.startsWith('/analytics') },
  { label: '横幅管理', icon: 'image', to: '/banners', active: route.path.startsWith('/banners') },
  { label: '弹窗管理', icon: 'campaign', to: '/popup', active: route.path.startsWith('/popup') },
  { label: '优惠券管理', icon: 'confirmation_number', to: '/coupons', active: route.path.startsWith('/coupons') },
])

const pageTitle = computed(() => {
  const map = { '/products': '商品管理', '/orders': '订单处理', '/': '工作台', '/analytics': '数据中心', '/banners': '横幅管理', '/popup': '弹窗管理', '/coupons': '优惠券管理' }
  return map[route.path] || '商品管理'
})
</script>
