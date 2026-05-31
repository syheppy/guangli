<template>
  <div class="space-y-8">
    <!-- 欢迎区域 -->
    <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-[28px] font-bold text-on-surface">欢迎回来，薯鲜生管理员</h2>
          <p class="text-[14px] text-on-surface-variant mt-2">今天是 {{ today }}，祝您生意兴隆！</p>
        </div>
        <div class="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
          <span class="material-symbols-outlined text-primary text-[40px]">storefront</span>
        </div>
      </div>
    </div>

    <!-- 快捷统计 -->
    <div class="grid grid-cols-4 gap-6">
      <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-6 border border-outline-variant/20">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary">inventory_2</span>
          </div>
          <div>
            <p class="text-[12px] text-on-surface-variant">商品总数</p>
            <p class="text-[24px] font-bold text-on-surface">{{ stats.products }}</p>
          </div>
        </div>
      </div>
      <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-6 border border-outline-variant/20">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-[#FFF3E0] flex items-center justify-center">
            <span class="material-symbols-outlined text-[#E65100]">receipt_long</span>
          </div>
          <div>
            <p class="text-[12px] text-on-surface-variant">今日订单</p>
            <p class="text-[24px] font-bold text-on-surface">{{ stats.orders }}</p>
          </div>
        </div>
      </div>
      <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-6 border border-outline-variant/20">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center">
            <span class="material-symbols-outlined text-[#2E7D32]">payments</span>
          </div>
          <div>
            <p class="text-[12px] text-on-surface-variant">今日收入</p>
            <p class="text-[24px] font-bold text-on-surface">¥{{ stats.revenue.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-6 border border-outline-variant/20">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-[#E3F2FD] flex items-center justify-center">
            <span class="material-symbols-outlined text-[#1565C0]">local_shipping</span>
          </div>
          <div>
            <p class="text-[12px] text-on-surface-variant">待发货</p>
            <p class="text-[24px] font-bold text-on-surface">{{ stats.pending }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8">
      <h3 class="text-[18px] font-semibold text-on-surface mb-6">快捷操作</h3>
      <div class="grid grid-cols-4 gap-4">
        <router-link
          to="/products"
          class="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10 hover:bg-primary/5 hover:border-primary/20 transition-all group"
        >
          <span class="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary transition-colors">add_circle</span>
          <span class="text-[14px] font-medium text-on-surface">发布商品</span>
        </router-link>
        <router-link
          to="/orders"
          class="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10 hover:bg-primary/5 hover:border-primary/20 transition-all group"
        >
          <span class="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary transition-colors">pending_actions</span>
          <span class="text-[14px] font-medium text-on-surface">处理订单</span>
        </router-link>
        <router-link
          to="/analytics"
          class="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10 hover:bg-primary/5 hover:border-primary/20 transition-all group"
        >
          <span class="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary transition-colors">bar_chart</span>
          <span class="text-[14px] font-medium text-on-surface">查看报表</span>
        </router-link>
        <div class="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10 hover:bg-primary/5 hover:border-primary/20 transition-all group cursor-pointer">
          <span class="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary transition-colors">settings</span>
          <span class="text-[14px] font-medium text-on-surface">店铺设置</span>
        </div>
      </div>
    </div>

    <!-- 最近订单 -->
    <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-[18px] font-semibold text-on-surface">最近订单</h3>
        <router-link to="/orders" class="text-[14px] text-primary hover:text-primary/80 transition-colors font-medium">
          查看全部
        </router-link>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-12">
        <span class="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
      </div>

      <div v-else-if="recentOrders.length === 0" class="flex flex-col items-center justify-center py-12">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3">receipt_long</span>
        <p class="text-on-surface-variant/50 text-[14px]">暂无订单数据</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="order in recentOrders"
          :key="order.id"
          class="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="statusBgClass(order.status)">
              <span class="material-symbols-outlined text-[20px]" :class="statusIconClass(order.status)">{{ statusIcon(order.status) }}</span>
            </div>
            <div>
              <p class="text-[14px] font-medium text-on-surface">{{ order.order_number }}</p>
              <p class="text-[12px] text-on-surface-variant">{{ order.consignee_name }} · {{ formatDate(order.created_at) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-[16px] font-semibold text-primary">¥{{ Number(order.total_amount).toFixed(2) }}</span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" :class="statusClass(order.status)">
              {{ statusText(order.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../utils/supabase.js'

const loading = ref(true)
const stats = ref({ products: 0, orders: 0, revenue: 0, pending: 0 })
const recentOrders = ref([])

const today = computed(() => {
  const d = new Date()
  const week = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${week[d.getDay()]}`
})

function statusText(status) {
  const map = {
    pending_payment: '待付款',
    pending_shipment: '待发货',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] || status
}

function statusClass(status) {
  const map = {
    pending_payment: 'bg-[#FFF3E0] text-[#E65100]',
    pending_shipment: 'bg-[#FFF8E1] text-[#F57F17]',
    shipped: 'bg-[#E3F2FD] text-[#1565C0]',
    completed: 'bg-[#E8F5E9] text-[#2E7D32]',
    cancelled: 'bg-[#FCE4EC] text-[#C62828]',
  }
  return map[status] || 'bg-surface-container-highest text-on-surface-variant'
}

function statusBgClass(status) {
  const map = {
    pending_payment: 'bg-[#FFF3E0]',
    pending_shipment: 'bg-[#FFF8E1]',
    shipped: 'bg-[#E3F2FD]',
    completed: 'bg-[#E8F5E9]',
    cancelled: 'bg-[#FCE4EC]',
  }
  return map[status] || 'bg-surface-container-highest'
}

function statusIconClass(status) {
  const map = {
    pending_payment: 'text-[#E65100]',
    pending_shipment: 'text-[#F57F17]',
    shipped: 'text-[#1565C0]',
    completed: 'text-[#2E7D32]',
    cancelled: 'text-[#C62828]',
  }
  return map[status] || 'text-on-surface-variant'
}

function statusIcon(status) {
  const map = {
    pending_payment: 'credit_card_off',
    pending_shipment: 'pending',
    shipped: 'local_shipping',
    completed: 'check_circle',
    cancelled: 'cancel',
  }
  return map[status] || 'receipt_long'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function fetchDashboardData() {
  loading.value = true

  const [productsRes, ordersRes] = await Promise.all([
    supabase.from('products').select('id'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
  ])

  if (!productsRes.error) {
    stats.value.products = productsRes.data?.length || 0
  }

  if (!ordersRes.error) {
    const orders = ordersRes.data || []
    recentOrders.value = orders.slice(0, 5)
    stats.value.orders = orders.length
    stats.value.revenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    stats.value.pending = orders.filter(o => o.status === 'pending_shipment').length
  }

  loading.value = false
}

onMounted(fetchDashboardData)
</script>
