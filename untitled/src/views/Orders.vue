<template>
  <div class="px-8 pb-12 pt-4 max-w-7xl mx-auto w-full">
    <!-- 顶部概览卡片 -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-[24px] p-6 shadow-sm border border-[#FAF5EE]">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-brand-orange">receipt_long</span>
          </div>
          <div>
            <p class="text-sm text-dark-brown/60">全部订单</p>
            <p class="text-2xl font-bold text-dark-brown">{{ orders.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-[24px] p-6 shadow-sm border border-[#FAF5EE]">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
            <span class="material-symbols-outlined text-amber-600">pending</span>
          </div>
          <div>
            <p class="text-sm text-dark-brown/60">待发货</p>
            <p class="text-2xl font-bold text-dark-brown">{{ pendingCount }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-[24px] p-6 shadow-sm border border-[#FAF5EE]">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
            <span class="material-symbols-outlined text-blue-600">local_shipping</span>
          </div>
          <div>
            <p class="text-sm text-dark-brown/60">已发货</p>
            <p class="text-2xl font-bold text-dark-brown">{{ shippedCount }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-[24px] p-6 shadow-sm border border-[#FAF5EE]">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <span class="material-symbols-outlined text-emerald-600">check_circle</span>
          </div>
          <div>
            <p class="text-sm text-dark-brown/60">已完成</p>
            <p class="text-2xl font-bold text-dark-brown">{{ completedCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-bold text-dark-brown">订单列表</h2>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-dark-brown/40 text-[20px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索订单号或收货人..."
            class="pl-10 pr-4 py-2.5 bg-white border border-[#FAF5EE] rounded-full text-sm text-dark-brown placeholder:text-dark-brown/40 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all w-[280px]"
          />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <select
          v-model="statusFilter"
          class="appearance-none bg-white border border-[#FAF5EE] rounded-full px-4 py-2.5 text-sm text-dark-brown focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all pr-10"
        >
          <option value="all">全部状态</option>
          <option value="pending">待发货</option>
          <option value="shipped">已发货</option>
          <option value="completed">已完成</option>
        </select>
        <span class="material-symbols-outlined absolute right-3 pointer-events-none text-dark-brown/40 text-[18px] -translate-y-0" style="position:relative; left:-36px;">expand_more</span>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <span class="material-symbols-outlined text-4xl text-brand-orange animate-spin">progress_activity</span>
    </div>

    <!-- 订单表格 -->
    <div v-else class="bg-white rounded-[24px] shadow-sm border border-[#FAF5EE] overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-[#FAF5EE]">
            <th class="px-6 py-4 text-xs font-medium text-dark-brown/60 tracking-wide">订单号</th>
            <th class="px-6 py-4 text-xs font-medium text-dark-brown/60 tracking-wide">收货人</th>
            <th class="px-6 py-4 text-xs font-medium text-dark-brown/60 tracking-wide">联系电话</th>
            <th class="px-6 py-4 text-xs font-medium text-dark-brown/60 tracking-wide">订单金额</th>
            <th class="px-6 py-4 text-xs font-medium text-dark-brown/60 tracking-wide">状态</th>
            <th class="px-6 py-4 text-xs font-medium text-dark-brown/60 tracking-wide">下单时间</th>
            <th class="px-6 py-4 text-xs font-medium text-dark-brown/60 tracking-wide">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#FAF5EE]/70">
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="hover:bg-[#FAF5EE]/30 transition-colors group"
          >
            <td class="px-6 py-5">
              <span class="text-sm font-medium text-dark-brown">{{ order.order_no }}</span>
            </td>
            <td class="px-6 py-5">
              <span class="text-sm text-dark-brown">{{ order.receiver_name }}</span>
            </td>
            <td class="px-6 py-5">
              <span class="text-sm text-dark-brown/70">{{ order.phone }}</span>
            </td>
            <td class="px-6 py-5">
              <span class="text-sm font-semibold text-brand-orange">¥{{ Number(order.total_amount).toFixed(2) }}</span>
            </td>
            <td class="px-6 py-5">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                :class="statusClass(order.status)"
              >
                {{ statusText(order.status) }}
              </span>
            </td>
            <td class="px-6 py-5">
              <span class="text-sm text-dark-brown/60">{{ formatDate(order.created_at) }}</span>
            </td>
            <td class="px-6 py-5">
              <div class="flex items-center gap-3">
                <button
                  @click="viewDetail(order)"
                  class="text-sm text-brand-orange hover:text-[#a85522] transition-colors font-medium"
                >
                  查看详情
                </button>
                <button
                  v-if="order.status === 'pending'"
                  @click="shipOrder(order)"
                  class="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                >
                  发货
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 空状态 -->
      <div v-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-16">
        <span class="material-symbols-outlined text-5xl text-dark-brown/20 mb-4">receipt_long</span>
        <p class="text-dark-brown/50 text-sm">暂无订单数据</p>
      </div>
    </div>

    <!-- 订单详情弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="detailVisible" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center" @click.self="detailVisible = false">
          <div class="bg-white rounded-[28px] shadow-xl w-[560px] max-h-[80vh] flex flex-col overflow-hidden">
            <!-- 弹窗头部 -->
            <div class="px-8 pt-8 pb-6 border-b border-[#FAF5EE]">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-bold text-dark-brown">订单详情</h3>
                  <p class="text-sm text-dark-brown/60 mt-1">订单号：{{ currentOrder?.order_no }}</p>
                </div>
                <button @click="detailVisible = false" class="w-10 h-10 rounded-full bg-[#FAF5EE] flex items-center justify-center hover:bg-[#f0e8dd] transition-colors">
                  <span class="material-symbols-outlined text-dark-brown/60">close</span>
                </button>
              </div>
            </div>

            <!-- 收货信息 -->
            <div class="px-8 py-5 border-b border-[#FAF5EE]/70 bg-[#FAF5EE]/30">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-dark-brown/50 mb-1">收货人</p>
                  <p class="text-sm font-medium text-dark-brown">{{ currentOrder?.receiver_name }}</p>
                </div>
                <div>
                  <p class="text-xs text-dark-brown/50 mb-1">联系电话</p>
                  <p class="text-sm font-medium text-dark-brown">{{ currentOrder?.phone }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs text-dark-brown/50 mb-1">收货地址</p>
                  <p class="text-sm font-medium text-dark-brown">{{ currentOrder?.address }}</p>
                </div>
              </div>
            </div>

            <!-- 商品明细 -->
            <div class="flex-1 overflow-y-auto px-8 py-5">
              <p class="text-xs font-medium text-dark-brown/60 mb-4 tracking-wide">商品明细</p>

              <!-- 加载中 -->
              <div v-if="itemsLoading" class="flex items-center justify-center py-8">
                <span class="material-symbols-outlined text-2xl text-brand-orange animate-spin">progress_activity</span>
              </div>

              <!-- 商品列表 -->
              <div v-else class="space-y-4">
                <div
                  v-for="item in orderItems"
                  :key="item.id"
                  class="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF5EE]/40 border border-[#FAF5EE]"
                >
                  <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white">
                    <img :src="item.image_url" :alt="item.product_name" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-dark-brown truncate">{{ item.product_name }}</p>
                    <p class="text-xs text-dark-brown/50 mt-1">单价 ¥{{ Number(item.unit_price).toFixed(2) }}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-sm font-semibold text-dark-brown">¥{{ (Number(item.unit_price) * item.quantity).toFixed(2) }}</p>
                    <p class="text-xs text-dark-brown/50 mt-1">x{{ item.quantity }}</p>
                  </div>
                </div>
              </div>

              <!-- 空明细 -->
              <div v-if="!itemsLoading && orderItems.length === 0" class="flex flex-col items-center justify-center py-8">
                <span class="material-symbols-outlined text-3xl text-dark-brown/20 mb-2">inventory_2</span>
                <p class="text-dark-brown/40 text-sm">暂无商品明细</p>
              </div>
            </div>

            <!-- 弹窗底部 -->
            <div class="px-8 py-6 border-t border-[#FAF5EE] flex items-center justify-between">
              <div>
                <p class="text-xs text-dark-brown/50">订单金额</p>
                <p class="text-xl font-bold text-brand-orange">¥{{ Number(currentOrder?.total_amount || 0).toFixed(2) }}</p>
              </div>
              <div class="flex gap-3">
                <button
                  v-if="currentOrder?.status === 'pending'"
                  @click="shipFromDetail"
                  class="px-6 py-2.5 rounded-full bg-brand-orange text-white text-sm font-medium hover:bg-[#a85522] transition-colors shadow-sm flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-[18px]">local_shipping</span>
                  立即发货
                </button>
                <button
                  v-if="currentOrder?.tracking_number"
                  class="px-6 py-2.5 rounded-full bg-[#FAF5EE] text-dark-brown text-sm font-medium flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-[18px]">tag</span>
                  {{ currentOrder.tracking_number }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../utils/supabase.js'

// ============ 状态变量 ============
const loading = ref(true)
const orders = ref([])
const searchQuery = ref('')
const statusFilter = ref('all')

// 弹窗相关
const detailVisible = ref(false)
const currentOrder = ref(null)
const orderItems = ref([])
const itemsLoading = ref(false)

// ============ 计算属性 ============
const pendingCount = computed(() => orders.value.filter(o => o.status === 'pending').length)
const shippedCount = computed(() => orders.value.filter(o => o.status === 'shipped').length)
const completedCount = computed(() => orders.value.filter(o => o.status === 'completed').length)

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchSearch = !searchQuery.value ||
      order.order_no.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.receiver_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value === 'all' || order.status === statusFilter.value
    return matchSearch && matchStatus
  })
})

// ============ 工具函数 ============
function statusText(status) {
  const map = { pending: '待发货', shipped: '已发货', completed: '已完成' }
  return map[status] || status
}

function statusClass(status) {
  const map = {
    pending: 'bg-amber-100 text-amber-700',
    shipped: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ============ 数据拉取 ============
async function fetchOrders() {
  loading.value = true
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('拉取订单列表失败:', error.message)
  } else {
    orders.value = data || []
  }
  loading.value = false
}

async function fetchOrderItems(orderId) {
  itemsLoading.value = true
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)

  if (error) {
    console.error('拉取订单明细失败:', error.message)
    orderItems.value = []
  } else {
    orderItems.value = data || []
  }
  itemsLoading.value = false
}

// ============ 交互函数 ============
function viewDetail(order) {
  currentOrder.value = order
  orderItems.value = []
  detailVisible.value = true
  fetchOrderItems(order.id)
}

async function shipOrder(order) {
  const trackingNumber = prompt('请输入快递单号：')
  if (!trackingNumber || !trackingNumber.trim()) return

  const { error } = await supabase
    .from('orders')
    .update({ status: 'shipped', tracking_number: trackingNumber.trim() })
    .eq('id', order.id)

  if (error) {
    console.error('发货失败:', error.message)
    alert('发货失败，请重试')
  } else {
    alert('发货成功！')
    await fetchOrders()
  }
}

function shipFromDetail() {
  if (!currentOrder.value) return
  detailVisible.value = false
  shipOrder(currentOrder.value)
}

// ============ 生命周期 ============
onMounted(fetchOrders)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
