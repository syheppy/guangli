<template>
  <div class="px-8 pb-12 pt-4 max-w-7xl mx-auto w-full">
    <!-- 顶部概览卡片 -->
    <div class="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div class="bg-surface-container-lowest rounded-[24px] p-5 cream-shadow border border-outline-variant/20 cursor-pointer hover:shadow-lg transition-shadow"
        :class="{ 'ring-2 ring-primary-500 bg-primary-50': statusFilter === 'all' }"
        @click="statusFilter = 'all'">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-on-surface">{{ orders.length }}</p>
            <p class="text-xs text-on-surface-variant">全部订单</p>
          </div>
        </div>
      </div>
      <div class="bg-surface-container-lowest rounded-[24px] p-5 cream-shadow border border-outline-variant/20 cursor-pointer hover:shadow-lg transition-shadow"
        :class="{ 'ring-2 ring-primary-500 bg-primary-50': statusFilter === 'pending_payment' }"
        @click="statusFilter = 'pending_payment'">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#FFF3E0] flex items-center justify-center">
            <span class="material-symbols-outlined text-[#E65100] text-[20px]">credit_card_off</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-on-surface">{{ pendingPaymentCount }}</p>
            <p class="text-xs text-on-surface-variant">待付款</p>
          </div>
        </div>
      </div>
      <div class="bg-surface-container-lowest rounded-[24px] p-5 cream-shadow border border-outline-variant/20 cursor-pointer hover:shadow-lg transition-shadow"
        :class="{ 'ring-2 ring-primary-500 bg-primary-50': statusFilter === 'pending_shipment' }"
        @click="statusFilter = 'pending_shipment'">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#FFF8E1] flex items-center justify-center">
            <span class="material-symbols-outlined text-[#F57F17] text-[20px]">pending</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-on-surface">{{ pendingShipmentCount }}</p>
            <p class="text-xs text-on-surface-variant">待发货</p>
          </div>
        </div>
      </div>
      <div class="bg-surface-container-lowest rounded-[24px] p-5 cream-shadow border border-outline-variant/20 cursor-pointer hover:shadow-lg transition-shadow"
        :class="{ 'ring-2 ring-primary-500 bg-primary-50': statusFilter === 'shipped' }"
        @click="statusFilter = 'shipped'">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#E3F2FD] flex items-center justify-center">
            <span class="material-symbols-outlined text-[#1565C0] text-[20px]">local_shipping</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-on-surface">{{ shippedCount }}</p>
            <p class="text-xs text-on-surface-variant">已发货</p>
          </div>
        </div>
      </div>
      <div class="bg-surface-container-lowest rounded-[24px] p-5 cream-shadow border border-outline-variant/20 cursor-pointer hover:shadow-lg transition-shadow"
        :class="{ 'ring-2 ring-primary-500 bg-primary-50': statusFilter === 'completed' }"
        @click="statusFilter = 'completed'">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
            <span class="material-symbols-outlined text-[#2E7D32] text-[20px]">check_circle</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-on-surface">{{ completedCount }}</p>
            <p class="text-xs text-on-surface-variant">已完成</p>
          </div>
        </div>
      </div>
      <div class="bg-surface-container-lowest rounded-[24px] p-5 cream-shadow border border-outline-variant/20 cursor-pointer hover:shadow-lg transition-shadow"
        :class="{ 'ring-2 ring-primary-500 bg-primary-50': statusFilter === 'cancelled' }"
        @click="statusFilter = 'cancelled'">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#FCE4EC] flex items-center justify-center">
            <span class="material-symbols-outlined text-[#C62828] text-[20px]">cancel</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-on-surface">{{ cancelledCount }}</p>
            <p class="text-xs text-on-surface-variant">已取消</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold text-on-surface">订单列表</h2>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60 text-[20px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索订单号或收货人..."
            class="pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-full text-[14px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-[280px]"
          />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <select
            v-model="statusFilter"
            class="appearance-none bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2.5 text-[14px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10"
          >
            <option value="all">全部状态</option>
            <option value="pending_payment">待付款</option>
            <option value="pending_shipment">待发货</option>
            <option value="shipped">已发货</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">expand_more</span>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
    </div>

    <!-- 订单表格 -->
    <div v-else class="bg-surface-container-lowest rounded-[24px] cream-shadow overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-surface-container-highest">
            <th class="px-6 py-4 text-[12px] font-medium text-on-surface-variant tracking-wide">订单号</th>
            <th class="px-6 py-4 text-[12px] font-medium text-on-surface-variant tracking-wide">收货人</th>
            <th class="px-6 py-4 text-[12px] font-medium text-on-surface-variant tracking-wide">联系电话</th>
            <th class="px-6 py-4 text-[12px] font-medium text-on-surface-variant tracking-wide">订单金额</th>
            <th class="px-6 py-4 text-[12px] font-medium text-on-surface-variant tracking-wide">状态</th>
            <th class="px-6 py-4 text-[12px] font-medium text-on-surface-variant tracking-wide">下单时间</th>
            <th class="px-6 py-4 text-[12px] font-medium text-on-surface-variant tracking-wide">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-container-highest/50">
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="hover:bg-surface-bright transition-colors group"
          >
            <td class="px-6 py-5">
              <span class="text-[14px] font-medium text-on-surface">{{ order.order_number }}</span>
            </td>
            <td class="px-6 py-5">
              <span class="text-[14px] text-on-surface">{{ order.consignee_name }}</span>
            </td>
            <td class="px-6 py-5">
              <span class="text-[14px] text-on-surface-variant">{{ order.consignee_phone }}</span>
            </td>
            <td class="px-6 py-5">
              <span class="text-[14px] font-semibold text-primary">¥{{ Number(order.total_amount).toFixed(2) }}</span>
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
              <span class="text-[14px] text-on-surface-variant">{{ formatDate(order.created_at) }}</span>
            </td>
            <td class="px-6 py-5">
              <div class="flex items-center gap-3">
                <button
                  @click="viewDetail(order)"
                  class="text-[12px] tracking-wide text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  查看详情
                </button>
                <button
                  v-if="order.status === 'pending_shipment'"
                  @click="shipOrder(order)"
                  class="text-[12px] tracking-wide text-[#2E7D32] hover:text-[#1B5E20] transition-colors font-medium"
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
        <span class="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4">receipt_long</span>
        <p class="text-on-surface-variant/50 text-[14px]">暂无订单数据</p>
      </div>
    </div>

    <!-- 订单详情弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="detailVisible" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center" @click.self="detailVisible = false">
          <div class="bg-surface-container-lowest rounded-[28px] cream-shadow w-[560px] max-h-[80vh] flex flex-col overflow-hidden">
            <!-- 弹窗头部 -->
            <div class="px-8 pt-8 pb-6 border-b border-outline-variant/20">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-[20px] font-semibold text-on-surface">订单详情</h3>
                  <p class="text-[14px] text-on-surface-variant mt-1">订单号：{{ currentOrder?.order_number }}</p>
                </div>
                <button @click="detailVisible = false" class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-container-high transition-colors">
                  <span class="material-symbols-outlined text-on-surface-variant">close</span>
                </button>
              </div>
            </div>

            <!-- 收货信息 -->
            <div class="px-8 py-5 border-b border-outline-variant/10 bg-surface-container-low/50">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-[12px] text-on-surface-variant mb-1">收货人</p>
                  <p class="text-[14px] font-medium text-on-surface">{{ currentOrder?.consignee_name }}</p>
                </div>
                <div>
                  <p class="text-[12px] text-on-surface-variant mb-1">联系电话</p>
                  <p class="text-[14px] font-medium text-on-surface">{{ currentOrder?.consignee_phone }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-[12px] text-on-surface-variant mb-1">收货地址</p>
                  <p class="text-[14px] font-medium text-on-surface">{{ currentOrder?.consignee_address }}</p>
                </div>
              </div>
            </div>

            <!-- 商品明细 -->
            <div class="flex-1 overflow-y-auto px-8 py-5">
              <p class="text-[12px] font-medium text-on-surface-variant mb-4 tracking-wide">商品明细</p>

              <!-- 加载中 -->
              <div v-if="itemsLoading" class="flex items-center justify-center py-8">
                <span class="material-symbols-outlined text-2xl text-primary animate-spin">progress_activity</span>
              </div>

              <!-- 商品列表 -->
              <div v-else class="space-y-4">
                <div
                  v-for="item in orderItems"
                  :key="item.id"
                  class="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10"
                >
                  <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-container-low">
                    <img :src="item.product_image" :alt="item.product_name" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[14px] font-medium text-on-surface truncate">{{ item.product_name }}</p>
                    <p class="text-[12px] text-on-surface-variant mt-1">单价 ¥{{ Number(item.price).toFixed(2) }}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-[14px] font-semibold text-on-surface">¥{{ (Number(item.price) * item.quantity).toFixed(2) }}</p>
                    <p class="text-[12px] text-on-surface-variant mt-1">x{{ item.quantity }}</p>
                  </div>
                </div>
              </div>

              <!-- 空明细 -->
              <div v-if="!itemsLoading && orderItems.length === 0" class="flex flex-col items-center justify-center py-8">
                <span class="material-symbols-outlined text-3xl text-on-surface-variant/20 mb-2">inventory_2</span>
                <p class="text-on-surface-variant/40 text-[14px]">暂无商品明细</p>
              </div>
            </div>

            <!-- 弹窗底部 -->
            <div class="px-8 py-6 border-t border-outline-variant/20 flex items-center justify-between">
              <div>
                <p class="text-[12px] text-on-surface-variant">订单金额</p>
                <p class="text-[20px] font-bold text-primary">¥{{ Number(currentOrder?.total_amount || 0).toFixed(2) }}</p>
              </div>
              <div class="flex gap-3">
                <button
                  v-if="currentOrder?.status === 'pending_shipment'"
                  @click="shipFromDetail"
                  class="px-6 py-2.5 rounded-full bg-primary text-on-primary text-[14px] font-medium hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2"
                >
                  <span class="material-symbols-outlined text-[18px]">local_shipping</span>
                  立即发货
                </button>
                <button
                  v-if="currentOrder?.tracking_number"
                  class="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface text-[14px] font-medium flex items-center gap-2"
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
const pendingPaymentCount = computed(() => orders.value.filter(o => o.status === 'pending_payment').length)
const pendingShipmentCount = computed(() => orders.value.filter(o => o.status === 'pending_shipment').length)
const shippedCount = computed(() => orders.value.filter(o => o.status === 'shipped').length)
const completedCount = computed(() => orders.value.filter(o => o.status === 'completed').length)
const cancelledCount = computed(() => orders.value.filter(o => o.status === 'cancelled').length)

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchSearch = !searchQuery.value ||
      order.order_number?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.consignee_name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value === 'all' || order.status === statusFilter.value
    return matchSearch && matchStatus
  })
})

// ============ 工具函数 ============
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
