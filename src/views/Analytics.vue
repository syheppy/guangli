<template>
  <div class="space-y-8">
    <!-- 页面标题 -->
    <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-[28px] font-bold text-on-surface">数据中心</h2>
          <p class="text-[14px] text-on-surface-variant mt-2">查看店铺运营数据与销售趋势</p>
        </div>
        <div class="flex items-center gap-3">
          <select
            v-model="timeRange"
            class="appearance-none bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2.5 text-[14px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10"
          >
            <option value="7">近7天</option>
            <option value="30">近30天</option>
            <option value="90">近90天</option>
          </select>
          <span class="material-symbols-outlined absolute right-3 pointer-events-none text-on-surface-variant text-[18px]" style="position:relative; left:-36px;">expand_more</span>
        </div>
      </div>
    </div>

    <!-- 核心指标 -->
    <div class="grid grid-cols-4 gap-6">
      <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-6 border border-outline-variant/20">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary">payments</span>
          </div>
          <span class="text-[12px] text-[#2E7D32] font-medium bg-[#E8F5E9] px-2 py-1 rounded-full">+12.5%</span>
        </div>
        <p class="text-[12px] text-on-surface-variant">总销售额</p>
        <p class="text-[24px] font-bold text-on-surface mt-1">¥{{ totalRevenue.toFixed(2) }}</p>
      </div>
      <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-6 border border-outline-variant/20">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-[#FFF3E0] flex items-center justify-center">
            <span class="material-symbols-outlined text-[#E65100]">receipt_long</span>
          </div>
          <span class="text-[12px] text-[#2E7D32] font-medium bg-[#E8F5E9] px-2 py-1 rounded-full">+8.3%</span>
        </div>
        <p class="text-[12px] text-on-surface-variant">订单总数</p>
        <p class="text-[24px] font-bold text-on-surface mt-1">{{ totalOrders }}</p>
      </div>
      <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-6 border border-outline-variant/20">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-[#E3F2FD] flex items-center justify-center">
            <span class="material-symbols-outlined text-[#1565C0]">trending_up</span>
          </div>
          <span class="text-[12px] text-[#2E7D32] font-medium bg-[#E8F5E9] px-2 py-1 rounded-full">+5.2%</span>
        </div>
        <p class="text-[12px] text-on-surface-variant">客单价</p>
        <p class="text-[24px] font-bold text-on-surface mt-1">¥{{ avgOrderValue.toFixed(2) }}</p>
      </div>
      <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-6 border border-outline-variant/20">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center">
            <span class="material-symbols-outlined text-[#2E7D32]">group</span>
          </div>
          <span class="text-[12px] text-[#2E7D32] font-medium bg-[#E8F5E9] px-2 py-1 rounded-full">+15.8%</span>
        </div>
        <p class="text-[12px] text-on-surface-variant">客户数</p>
        <p class="text-[24px] font-bold text-on-surface mt-1">{{ uniqueCustomers }}</p>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-3 gap-6">
      <!-- 销售趋势 -->
      <div class="col-span-2 bg-surface-container-lowest rounded-[24px] cream-shadow p-8">
        <h3 class="text-[18px] font-semibold text-on-surface mb-6">销售趋势</h3>
        <div class="h-[300px] flex items-end justify-between gap-2 px-4">
          <div
            v-for="(day, index) in chartData"
            :key="index"
            class="flex-1 flex flex-col items-center gap-2"
          >
            <div class="text-[12px] text-on-surface-variant font-medium">¥{{ day.value }}</div>
            <div
              class="w-full rounded-t-lg transition-all duration-500"
              :class="index === chartData.length - 1 ? 'bg-primary' : 'bg-primary/30'"
              :style="{ height: `${Math.max((day.value / maxChartValue) * 200, 8)}px` }"
            ></div>
            <div class="text-[12px] text-on-surface-variant">{{ day.label }}</div>
          </div>
        </div>
      </div>

      <!-- 订单状态分布 -->
      <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8">
        <h3 class="text-[18px] font-semibold text-on-surface mb-6">订单状态分布</h3>
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#E65100]"></div>
                <span class="text-[13px] text-on-surface">待付款</span>
              </div>
              <span class="text-[13px] font-semibold text-on-surface">{{ statusCounts.pending_payment }}</span>
            </div>
            <div class="h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div class="h-full bg-[#E65100] rounded-full transition-all duration-500" :style="{ width: `${statusPercentages.pending_payment}%` }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#F57F17]"></div>
                <span class="text-[13px] text-on-surface">待发货</span>
              </div>
              <span class="text-[13px] font-semibold text-on-surface">{{ statusCounts.pending_shipment }}</span>
            </div>
            <div class="h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div class="h-full bg-[#F57F17] rounded-full transition-all duration-500" :style="{ width: `${statusPercentages.pending_shipment}%` }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#1565C0]"></div>
                <span class="text-[13px] text-on-surface">已发货</span>
              </div>
              <span class="text-[13px] font-semibold text-on-surface">{{ statusCounts.shipped }}</span>
            </div>
            <div class="h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div class="h-full bg-[#1565C0] rounded-full transition-all duration-500" :style="{ width: `${statusPercentages.shipped}%` }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#2E7D32]"></div>
                <span class="text-[13px] text-on-surface">已完成</span>
              </div>
              <span class="text-[13px] font-semibold text-on-surface">{{ statusCounts.completed }}</span>
            </div>
            <div class="h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div class="h-full bg-[#2E7D32] rounded-full transition-all duration-500" :style="{ width: `${statusPercentages.completed}%` }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-[#C62828]"></div>
                <span class="text-[13px] text-on-surface">已取消</span>
              </div>
              <span class="text-[13px] font-semibold text-on-surface">{{ statusCounts.cancelled }}</span>
            </div>
            <div class="h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div class="h-full bg-[#C62828] rounded-full transition-all duration-500" :style="{ width: `${statusPercentages.cancelled}%` }"></div>
            </div>
          </div>
        </div>

        <!-- 饼图替代 -->
        <div class="mt-8 flex items-center justify-center">
          <div class="relative w-40 h-40">
            <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#E8F5E9" stroke-width="12" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#2E7D32" stroke-width="12"
                :stroke-dasharray="`${statusPercentages.completed * 2.51} ${251 - statusPercentages.completed * 2.51}`"
                stroke-dashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1565C0" stroke-width="12"
                :stroke-dasharray="`${statusPercentages.shipped * 2.51} ${251 - statusPercentages.shipped * 2.51}`"
                :stroke-dashoffset="`-${statusPercentages.completed * 2.51}`" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F57F17" stroke-width="12"
                :stroke-dasharray="`${statusPercentages.pending_shipment * 2.51} ${251 - statusPercentages.pending_shipment * 2.51}`"
                :stroke-dashoffset="`-${(statusPercentages.completed + statusPercentages.shipped) * 2.51}`" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#E65100" stroke-width="12"
                :stroke-dasharray="`${statusPercentages.pending_payment * 2.51} ${251 - statusPercentages.pending_payment * 2.51}`"
                :stroke-dashoffset="`-${(statusPercentages.completed + statusPercentages.shipped + statusPercentages.pending_shipment) * 2.51}`" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#C62828" stroke-width="12"
                :stroke-dasharray="`${statusPercentages.cancelled * 2.51} ${251 - statusPercentages.cancelled * 2.51}`"
                :stroke-dashoffset="`-${(statusPercentages.completed + statusPercentages.shipped + statusPercentages.pending_shipment + statusPercentages.pending_payment) * 2.51}`" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <p class="text-[24px] font-bold text-on-surface">{{ totalOrders }}</p>
                <p class="text-[12px] text-on-surface-variant">总订单</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热销商品 -->
    <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8">
      <h3 class="text-[18px] font-semibold text-on-surface mb-6">热销商品 TOP 5</h3>

      <div v-if="loading" class="flex items-center justify-center py-12">
        <span class="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
      </div>

      <div v-else-if="topProducts.length === 0" class="flex flex-col items-center justify-center py-12">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3">inventory_2</span>
        <p class="text-on-surface-variant/50 text-[14px]">暂无销售数据</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(product, index) in topProducts"
          :key="product.name"
          class="flex items-center gap-6 p-4 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold"
            :class="index === 0 ? 'bg-[#FFD700] text-[#7B6100]' : index === 1 ? 'bg-[#C0C0C0] text-[#4A4A4A]' : index === 2 ? 'bg-[#CD7F32] text-[#5C3317]' : 'bg-surface-container-highest text-on-surface-variant'"
          >
            {{ index + 1 }}
          </div>
          <div class="flex-1">
            <p class="text-[14px] font-medium text-on-surface">{{ product.name }}</p>
            <p class="text-[12px] text-on-surface-variant">销量 {{ product.count }} 件</p>
          </div>
          <div class="text-right">
            <p class="text-[16px] font-semibold text-primary">¥{{ product.revenue.toFixed(2) }}</p>
            <p class="text-[12px] text-on-surface-variant">销售额</p>
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
const timeRange = ref('7')
const orders = ref([])
const orderItems = ref([])

const totalRevenue = computed(() => orders.value.reduce((sum, o) => sum + Number(o.total_amount || 0), 0))
const totalOrders = computed(() => orders.value.length)
const avgOrderValue = computed(() => totalOrders.value > 0 ? totalRevenue.value / totalOrders.value : 0)
const uniqueCustomers = computed(() => {
  const names = new Set(orders.value.map(o => o.consignee_name))
  return names.size
})

const statusCounts = computed(() => ({
  pending_payment: orders.value.filter(o => o.status === 'pending_payment').length,
  pending_shipment: orders.value.filter(o => o.status === 'pending_shipment').length,
  shipped: orders.value.filter(o => o.status === 'shipped').length,
  completed: orders.value.filter(o => o.status === 'completed').length,
  cancelled: orders.value.filter(o => o.status === 'cancelled').length,
}))

const statusPercentages = computed(() => {
  const total = totalOrders.value || 1
  return {
    pending_payment: (statusCounts.value.pending_payment / total) * 100,
    pending_shipment: (statusCounts.value.pending_shipment / total) * 100,
    shipped: (statusCounts.value.shipped / total) * 100,
    completed: (statusCounts.value.completed / total) * 100,
    cancelled: (statusCounts.value.cancelled / total) * 100,
  }
})

const chartData = computed(() => {
  const days = parseInt(timeRange.value)
  const data = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const dayOrders = orders.value.filter(o => {
      const orderDate = new Date(o.created_at).toISOString().split('T')[0]
      return orderDate === dateStr
    })

    const revenue = dayOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)

    data.push({
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      value: Math.round(revenue),
    })
  }

  return data
})

const maxChartValue = computed(() => {
  return Math.max(...chartData.value.map(d => d.value), 1)
})

const topProducts = computed(() => {
  const productMap = {}

  orderItems.value.forEach(item => {
    const name = item.product_name
    if (!productMap[name]) {
      productMap[name] = { name, count: 0, revenue: 0 }
    }
    productMap[name].count += item.quantity
    productMap[name].revenue += Number(item.price) * item.quantity
  })

  return Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
})

async function fetchData() {
  loading.value = true

  const [ordersRes, itemsRes] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('order_items').select('*'),
  ])

  if (!ordersRes.error) {
    orders.value = ordersRes.data || []
  }

  if (!itemsRes.error) {
    orderItems.value = itemsRes.data || []
  }

  loading.value = false
}

onMounted(fetchData)
</script>
