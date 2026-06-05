<template>
  <div class="space-y-6">
    <!-- 页面标题 + 发放按钮 -->
    <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8 flex items-center justify-between">
      <div>
        <h2 class="text-[28px] font-bold text-on-surface">优惠券管理</h2>
        <p class="text-[14px] text-on-surface-variant mt-2">管理用户优惠券，支持发放和查看使用情况</p>
      </div>
      <button
        @click="openGrant"
        class="bg-primary text-on-primary px-6 py-2.5 rounded-full text-[12px] tracking-wide hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        发放优惠券
      </button>
    </div>

    <!-- 筛选标签 -->
    <div class="flex gap-3">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        class="px-4 py-2 rounded-full text-[13px] font-medium border transition-colors"
        :class="activeTab === tab.value ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary/50'"
      >{{ tab.label }}</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredCoupons.length === 0" class="bg-surface-container-lowest rounded-[24px] cream-shadow p-16 flex flex-col items-center">
      <span class="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4">confirmation_number</span>
      <p class="text-on-surface-variant/50 text-[14px]">暂无优惠券</p>
    </div>

    <!-- 优惠券列表 -->
    <div v-else class="space-y-3">
      <div
        v-for="coupon in filteredCoupons"
        :key="coupon.id"
        class="bg-surface-container-lowest rounded-2xl cream-shadow p-5 flex items-center gap-4"
      >
        <!-- 左侧：类型图标 -->
        <div class="w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0"
          :class="coupon.type === 'shipping' ? 'bg-tertiary/10' : 'bg-primary/10'"
        >
          <template v-if="coupon.type === 'shipping'">
            <span class="text-tertiary font-bold text-[14px]">包邮</span>
          </template>
          <template v-else-if="coupon.type === 'amount'">
            <span class="text-primary text-[10px]">¥</span>
            <span class="text-primary font-bold text-[18px]">{{ coupon.value }}</span>
          </template>
          <template v-else>
            <span class="text-primary font-bold text-[18px]">{{ coupon.value }}</span>
            <span class="text-primary text-[10px]">折</span>
          </template>
        </div>

        <!-- 中间：信息 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h4 class="text-[14px] font-medium text-on-surface truncate">{{ coupon.title }}</h4>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-medium"
              :class="{
                'bg-[#E8F5E9] text-[#2E7D32]': coupon.status === 'unused',
                'bg-surface-container-highest text-on-surface-variant': coupon.status === 'used',
                'bg-error/10 text-error': coupon.status === 'expired'
              }"
            >{{ coupon.status === 'unused' ? '未使用' : coupon.status === 'used' ? '已使用' : '已过期' }}</span>
          </div>
          <p class="text-[12px] text-on-surface-variant">用户：{{ coupon.user_email || coupon.user_id }}</p>
          <p class="text-[11px] text-outline mt-1">有效期至：{{ coupon.expiry }}</p>
        </div>

        <!-- 右侧：操作 -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            v-if="coupon.status === 'unused'"
            @click="revokeCoupon(coupon)"
            class="px-3 py-1.5 rounded-lg text-[12px] font-medium text-error border border-error/30 hover:bg-error/10 transition-colors"
          >作废</button>
        </div>
      </div>
    </div>

    <!-- 发放优惠券弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="grantVisible" class="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center" @click.self="grantVisible = false">
          <div class="bg-white rounded-2xl w-[440px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div class="px-6 py-5 border-b border-outline-variant">
              <h3 class="text-[18px] font-semibold text-[#3A302A]">发放优惠券</h3>
            </div>
            <div class="flex-1 overflow-y-auto p-6 space-y-5">
              <!-- 优惠券类型 -->
              <div class="space-y-2">
                <label class="text-[13px] font-medium text-on-surface">优惠券类型</label>
                <div class="flex gap-2">
                  <button
                    v-for="t in couponTypes"
                    :key="t.value"
                    @click="grantForm.type = t.value"
                    class="px-4 py-2 rounded-lg text-[13px] font-medium border transition-colors"
                    :class="grantForm.type === t.value ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant'"
                  >{{ t.label }}</button>
                </div>
              </div>

              <!-- 面值（满减/折扣） -->
              <div v-if="grantForm.type !== 'shipping'" class="space-y-2">
                <label class="text-[13px] font-medium text-on-surface">{{ grantForm.type === 'amount' ? '面值（元）' : '折扣（折）' }}</label>
                <input v-model.number="grantForm.value" type="number" :placeholder="grantForm.type === 'amount' ? '如：15' : '如：9.2'" class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[14px]" />
              </div>

              <!-- 使用条件 -->
              <div class="space-y-2">
                <label class="text-[13px] font-medium text-on-surface">使用条件</label>
                <input v-model="grantForm.condition" type="text" placeholder="如：满99可用、无门槛" class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[14px]" />
              </div>

              <!-- 券名称 -->
              <div class="space-y-2">
                <label class="text-[13px] font-medium text-on-surface">优惠券名称</label>
                <input v-model="grantForm.title" type="text" placeholder="如：新人包邮券" class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[14px]" />
              </div>

              <!-- 有效期 -->
              <div class="space-y-2">
                <label class="text-[13px] font-medium text-on-surface">有效期（天）</label>
                <input v-model.number="grantForm.days" type="number" placeholder="如：30" class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[14px]" />
              </div>

              <!-- 发放对象 -->
              <div class="space-y-2">
                <label class="text-[13px] font-medium text-on-surface">发放对象</label>
                <div class="flex gap-2">
                  <button
                    v-for="target in grantTargets"
                    :key="target.value"
                    @click="grantForm.target = target.value"
                    class="px-4 py-2 rounded-lg text-[13px] font-medium border transition-colors"
                    :class="grantForm.target === target.value ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant'"
                  >{{ target.label }}</button>
                </div>
              </div>

              <!-- 指定用户 -->
              <div v-if="grantForm.target === 'specific'" class="space-y-2">
                <label class="text-[13px] font-medium text-on-surface">用户邮箱</label>
                <input v-model="grantForm.userEmail" type="email" placeholder="请输入用户邮箱" class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[14px]" />
              </div>

              <!-- 发放数量 -->
              <div class="space-y-2">
                <label class="text-[13px] font-medium text-on-surface">发放数量（张）</label>
                <input v-model.number="grantForm.count" type="number" min="1" max="100" placeholder="如：3" class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[14px]" />
              </div>
            </div>
            <div class="px-6 py-4 border-t border-outline-variant flex gap-4 justify-end">
              <button @click="grantVisible = false" class="px-6 py-2.5 rounded-full text-[13px] font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors border border-outline-variant">取消</button>
              <button @click="handleGrant" :disabled="granting" class="px-6 py-2.5 rounded-full text-[13px] font-medium bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50">
                {{ granting ? '发放中...' : '确认发放' }}
              </button>
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

const loading = ref(true)
const coupons = ref([])
const activeTab = ref('all')
const grantVisible = ref(false)
const granting = ref(false)

const tabs = [
  { value: 'all', label: '全部' },
  { value: 'unused', label: '未使用' },
  { value: 'used', label: '已使用' },
  { value: 'expired', label: '已过期' }
]

const couponTypes = [
  { value: 'shipping', label: '包邮券' },
  { value: 'amount', label: '满减券' },
  { value: 'discount', label: '折扣券' }
]

const grantTargets = [
  { value: 'specific', label: '指定用户' },
  { value: 'all', label: '全部用户' }
]

const grantForm = ref({
  type: 'shipping',
  value: 0,
  condition: '无门槛',
  title: '',
  days: 30,
  target: 'specific',
  userEmail: '',
  count: 1
})

const filteredCoupons = computed(() => {
  if (activeTab.value === 'all') return coupons.value
  return coupons.value.filter(c => c.status === activeTab.value)
})

onMounted(fetchCoupons)

async function fetchCoupons() {
  loading.value = true
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })
  if (data) coupons.value = data
  loading.value = false
}

function openGrant() {
  grantForm.value = { type: 'shipping', value: 0, condition: '无门槛', title: '', days: 30, target: 'specific', userEmail: '', count: 1 }
  grantVisible.value = true
}

async function handleGrant() {
  if (!grantForm.value.title) { alert('请输入优惠券名称'); return }
  granting.value = true

  try {
    let userIds = []

    if (grantForm.value.target === 'specific') {
      // 通过数据库函数查找用户
      const { data: userId, error: lookupError } = await supabase
        .rpc('get_user_id_by_email', { user_email: grantForm.value.userEmail })
      if (lookupError || !userId) { alert('未找到该用户'); granting.value = false; return }
      userIds = [userId]
    } else {
      // 全部用户：通过订单表获取所有下过单的用户
      const { data: orders } = await supabase
        .from('orders')
        .select('user_id')
        .not('user_id', 'is', null)
      const uniqueIds = [...new Set((orders || []).map(o => o.user_id))]
      if (uniqueIds.length === 0) { alert('暂无用户数据'); granting.value = false; return }
      userIds = uniqueIds
    }

    // 生成优惠券
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + grantForm.value.days)

    const couponsToInsert = []
    for (const uid of userIds) {
      for (let i = 0; i < grantForm.value.count; i++) {
        couponsToInsert.push({
          user_id: uid,
          type: grantForm.value.type,
          value: grantForm.value.value,
          condition: grantForm.value.condition,
          title: grantForm.value.title,
          tag: '',
          description: '',
          status: 'unused',
          expiry: expiryDate.toISOString().split('T')[0]
        })
      }
    }

    const { error } = await supabase.from('coupons').insert(couponsToInsert)
    if (error) throw error

    alert(`成功发放 ${couponsToInsert.length} 张优惠券`)
    grantVisible.value = false
    await fetchCoupons()
  } catch (err) {
    console.error('发放失败:', err)
    alert('发放失败：' + err.message)
  } finally {
    granting.value = false
  }
}

async function revokeCoupon(coupon) {
  if (!confirm(`确定作废这张优惠券吗？`)) return
  const { error } = await supabase.from('coupons').update({ status: 'expired' }).eq('id', coupon.id)
  if (error) { alert('操作失败'); return }
  coupon.status = 'expired'
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
