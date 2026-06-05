<template>
  <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8 flex flex-col h-full min-h-[600px] relative">
    <!-- Action Bar -->
    <div class="flex justify-between items-center mb-8">
      <h3 class="text-[20px] font-semibold text-on-surface">弹窗管理</h3>
      <button
        @click="openDrawer(null)"
        class="bg-primary text-on-primary px-6 py-2.5 rounded-full text-[12px] tracking-wide hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        新建弹窗
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <span class="material-symbols-outlined text-[40px] text-primary animate-spin">progress_activity</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="popups.length === 0" class="flex-1 flex flex-col items-center justify-center">
      <span class="material-symbols-outlined text-[64px] text-on-surface-variant/20 mb-4">notifications_none</span>
      <p class="text-on-surface-variant/40 text-[16px]">暂无弹窗配置</p>
      <button @click="openDrawer(null)" class="mt-4 text-primary text-[14px] hover:underline">创建第一个弹窗</button>
    </div>

    <!-- Popup List -->
    <div v-else class="space-y-4">
      <div
        v-for="popup in popups"
        :key="popup.id"
        class="bg-white rounded-2xl border border-outline-variant/20 p-6 flex items-start gap-6 hover:shadow-md transition-shadow"
      >
        <!-- Image Preview -->
        <div class="w-32 h-32 rounded-xl overflow-hidden bg-surface-container-low shrink-0">
          <img v-if="popup.image_url" :src="popup.image_url" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="material-symbols-outlined text-[32px] text-on-surface-variant/20">image</span>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-2">
            <h4 class="text-[16px] font-semibold text-on-surface truncate">{{ popup.title }}</h4>
            <span
              class="px-2 py-0.5 rounded-full text-[11px] font-medium"
              :class="popup.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
            >
              {{ popup.is_active ? '已启用' : '已禁用' }}
            </span>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
              {{ popup.frequency === 'every' ? '每次显示' : '每天一次' }}
            </span>
          </div>
          <p v-if="popup.content" class="text-[13px] text-on-surface-variant mb-2 line-clamp-2">{{ popup.content }}</p>
          <div class="flex items-center gap-4 text-[12px] text-on-surface-variant/60">
            <span v-if="popup.link_url" class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">link</span>
              {{ popup.link_text || '立即查看' }}
            </span>
            <span>{{ formatDate(popup.created_at) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="toggleActive(popup)"
            class="px-3 py-1.5 rounded-full text-[12px] border transition-colors"
            :class="popup.is_active
              ? 'border-green-200 text-green-600 hover:bg-green-50'
              : 'border-gray-200 text-gray-500 hover:bg-gray-50'"
          >
            {{ popup.is_active ? '禁用' : '启用' }}
          </button>
          <button
            @click="openDrawer(popup)"
            class="px-3 py-1.5 rounded-full text-[12px] border border-outline-variant text-secondary hover:bg-surface-container-low transition-colors"
          >编辑</button>
          <button
            @click="confirmDelete(popup)"
            class="px-3 py-1.5 rounded-full text-[12px] border border-error/30 text-error hover:bg-error/5 transition-colors"
          >删除</button>
        </div>
      </div>
    </div>

    <!-- Drawer -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="drawerVisible" class="fixed inset-0 bg-black/20 z-40" @click="closeDrawer"></div>
      </Transition>
      <Transition name="slide">
        <div v-if="drawerVisible" class="fixed right-0 top-0 h-full w-1/3 bg-white z-50 shadow-2xl flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-outline-variant">
            <h2 class="text-[24px] font-semibold text-[#3A302A]">{{ editing ? '编辑弹窗' : '新建弹窗' }}</h2>
            <button @click="closeDrawer" class="p-2 hover:bg-surface-container rounded-full transition-colors">
              <span class="material-symbols-outlined text-[#3A302A]">close</span>
            </button>
          </div>

          <!-- Form -->
          <div class="flex-1 overflow-y-auto p-8 space-y-6">
            <!-- 标题 -->
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">弹窗标题</label>
              <input
                v-model="form.title"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                placeholder="如：限时优惠活动"
                type="text"
              />
            </div>

            <!-- 内容 -->
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">弹窗内容</label>
              <textarea
                v-model="form.content"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all resize-none"
                placeholder="如：新用户首单立减20元"
                rows="3"
              ></textarea>
            </div>

            <!-- 关联商品 -->
            <div class="space-y-3 p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/20">
              <label class="block font-medium text-[#3A302A] flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px] text-primary">link</span>
                关联商品（可选）
              </label>
              <div class="relative">
                <select
                  v-model="selectedProductId"
                  @change="onProductSelect"
                  class="w-full appearance-none px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                >
                  <option value="">不关联商品</option>
                  <option v-for="p in products" :key="p.id" :value="p.id">
                    {{ p.name }} - ¥{{ p.price }}
                  </option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#3A302A]">expand_more</span>
              </div>

              <!-- 选中商品预览 -->
              <div v-if="selectedProduct" class="flex items-center gap-3 p-3 bg-white rounded-lg border border-outline-variant/30">
                <img :src="selectedProduct.image_url" class="w-12 h-12 rounded-lg object-cover" />
                <div class="flex-1 min-w-0">
                  <p class="text-[13px] font-medium text-[#3A302A] truncate">{{ selectedProduct.name }}</p>
                  <p class="text-[12px] text-on-surface-variant">链接：/product/{{ selectedProduct.id }}</p>
                </div>
                <label class="flex items-center gap-2 cursor-pointer shrink-0">
                  <input
                    v-model="useProductImage"
                    type="checkbox"
                    class="accent-[#C2652A] w-4 h-4"
                    @change="onUseProductImageChange"
                  />
                  <span class="text-[12px] text-[#3A302A]">使用商品图</span>
                </label>
              </div>
            </div>

            <!-- 图片上传 -->
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">
                弹窗图片
                <span v-if="useProductImage && selectedProduct" class="text-[12px] text-primary font-normal ml-2">
                  （已使用商品图片）
                </span>
              </label>
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected" />

              <div v-if="previewUrl" class="relative rounded-2xl overflow-hidden border border-[#ECE6DC] group">
                <img :src="previewUrl" class="w-full h-48 object-cover" />
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="fileInput.click()" class="px-4 py-2 bg-white/90 rounded-full text-[12px] font-medium text-[#3A302A] hover:bg-white transition-colors shadow-sm">重新上传</button>
                    <button @click="removeImage" class="px-4 py-2 bg-white/90 rounded-full text-[12px] font-medium text-error hover:bg-white transition-colors shadow-sm">删除</button>
                  </div>
                </div>
                <div v-if="uploading" class="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span class="material-symbols-outlined text-[32px] text-primary animate-spin">progress_activity</span>
                </div>
              </div>

              <div v-else @click="fileInput.click()" class="border-2 border-dashed border-[#ECE6DC] rounded-2xl h-40 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-colors cursor-pointer group">
                <span v-if="uploading" class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                <template v-else>
                  <span class="material-symbols-outlined text-4xl text-[#3A302A]/40 group-hover:text-[#C2652A] transition-colors">add</span>
                  <span class="text-[12px] tracking-wide text-[#3A302A]/60">点击上传弹窗图片</span>
                </template>
              </div>
            </div>

            <!-- 跳转链接 -->
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">
                跳转链接
                <span v-if="selectedProductId" class="text-[12px] text-primary font-normal ml-2">
                  （已关联商品）
                </span>
              </label>
              <input
                v-model="form.link_url"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                :placeholder="selectedProductId ? `/product/${selectedProductId}` : '如：/product/xxx 或 https://...'"
                type="text"
              />
            </div>

            <!-- 按钮文字 -->
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">按钮文字</label>
              <input
                v-model="form.link_text"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                placeholder="立即查看"
                type="text"
              />
            </div>

            <!-- 显示频率 -->
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">显示频率</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="form.frequency" type="radio" value="every" class="accent-[#C2652A]" />
                  <span class="text-[14px] text-[#3A302A]">每次进入都显示</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="form.frequency" type="radio" value="daily" class="accent-[#C2652A]" />
                  <span class="text-[14px] text-[#3A302A]">每天显示一次</span>
                </label>
              </div>
            </div>

            <!-- 启用状态 -->
            <div class="space-y-2">
              <label class="flex items-center gap-3 cursor-pointer">
                <input v-model="form.is_active" type="checkbox" class="accent-[#C2652A] w-5 h-5" />
                <span class="font-medium text-[#3A302A]">启用弹窗</span>
              </label>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t border-outline-variant bg-white mt-auto flex gap-4">
            <button @click="closeDrawer" class="flex-1 py-3 px-6 rounded-full font-medium text-secondary hover:bg-surface-container-low transition-colors border border-[#ECE6DC]">取消</button>
            <button @click="onSubmit" class="flex-1 py-3 px-6 rounded-full font-medium bg-[#C2652A] text-white hover:opacity-90 transition-opacity shadow-sm">{{ editing ? '保存修改' : '确认创建' }}</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirm -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="deleteTarget" class="fixed inset-0 bg-black/20 z-[60] flex items-center justify-center" @click.self="deleteTarget = null">
          <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8 w-[400px] flex flex-col gap-6">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-error text-[28px]">warning</span>
              <h3 class="text-[20px] font-semibold text-on-surface">确认删除</h3>
            </div>
            <p class="text-[14px] text-on-surface-variant leading-relaxed">
              确定要删除「{{ deleteTarget.title }}」吗？此操作无法撤销。
            </p>
            <div class="flex gap-4 justify-end">
              <button @click="deleteTarget = null" class="px-6 py-2.5 rounded-full text-[14px] font-medium text-secondary hover:bg-surface-container-low transition-colors border border-outline-variant">取消</button>
              <button @click="doDelete" class="px-6 py-2.5 rounded-full text-[14px] font-medium bg-error text-on-error hover:opacity-90 transition-opacity shadow-sm">确认删除</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '../utils/supabase.js'
import imageCompression from 'browser-image-compression'

const loading = ref(true)
const popups = ref([])
const products = ref([])
const drawerVisible = ref(false)
const editing = ref(null)
const deleteTarget = ref(null)
const fileInput = ref(null)
const uploading = ref(false)
const previewUrl = ref('')
const selectedProductId = ref('')
const useProductImage = ref(false)

const emptyForm = () => ({
  title: '',
  content: '',
  image_url: '',
  link_url: '',
  link_text: '立即查看',
  frequency: 'daily',
  is_active: true,
})

const form = reactive(emptyForm())

// 选中的商品
const selectedProduct = computed(() => {
  if (!selectedProductId.value) return null
  return products.value.find(p => p.id === selectedProductId.value) || null
})

async function fetchPopups() {
  loading.value = true
  const { data, error } = await supabase
    .from('popups')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('拉取弹窗列表失败:', error.message)
  } else {
    popups.value = data
  }
  loading.value = false
}

async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .eq('status', true)
    .order('name')

  if (!error) {
    products.value = data
  }
}

onMounted(() => {
  fetchPopups()
  fetchProducts()
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function openDrawer(popup) {
  editing.value = popup
  if (popup) {
    Object.assign(form, {
      title: popup.title || '',
      content: popup.content || '',
      image_url: popup.image_url || '',
      link_url: popup.link_url || '',
      link_text: popup.link_text || '立即查看',
      frequency: popup.frequency || 'daily',
      is_active: popup.is_active ?? true,
    })
    previewUrl.value = popup.image_url || ''

    // 检查是否关联了商品
    const link = popup.link_url || ''
    const match = link.match(/\/product\/([a-f0-9-]+)/)
    if (match) {
      selectedProductId.value = match[1]
      // 检查图片是否是商品图片
      const product = products.value.find(p => p.id === match[1])
      if (product && popup.image_url === product.image_url) {
        useProductImage.value = true
      } else {
        useProductImage.value = false
      }
    } else {
      selectedProductId.value = ''
      useProductImage.value = false
    }
  } else {
    Object.assign(form, emptyForm())
    previewUrl.value = ''
    selectedProductId.value = ''
    useProductImage.value = false
  }
  drawerVisible.value = true
}

function closeDrawer() {
  drawerVisible.value = false
  editing.value = null
}

// 选择商品
function onProductSelect() {
  if (selectedProduct.value) {
    // 自动填充链接
    form.link_url = `/product/${selectedProduct.value.id}`
    // 如果勾选了使用商品图片，自动填充图片
    if (useProductImage.value) {
      form.image_url = selectedProduct.value.image_url
      previewUrl.value = selectedProduct.value.image_url
    }
  } else {
    // 取消选择时清空链接（如果不是手动输入的）
    if (form.link_url.startsWith('/product/')) {
      form.link_url = ''
    }
  }
}

// 使用商品图片变化
function onUseProductImageChange() {
  if (useProductImage.value && selectedProduct.value) {
    form.image_url = selectedProduct.value.image_url
    previewUrl.value = selectedProduct.value.image_url
  }
}

async function onFileSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return

  uploading.value = true
  useProductImage.value = false // 手动上传时取消商品图片勾选

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 10,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      initialQuality: 0.7,
      fileType: 'image/webp',
    })

    const fileName = `popups/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, compressedFile, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      console.error('图片上传失败:', uploadError.message)
      return
    }

    const { data } = supabase.storage.from('products').getPublicUrl(fileName)
    form.image_url = data.publicUrl
    previewUrl.value = data.publicUrl
  } catch (err) {
    console.error('图片压缩失败:', err.message)
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}

function removeImage() {
  form.image_url = ''
  previewUrl.value = ''
  useProductImage.value = false
}

async function onSubmit() {
  if (!form.title.trim()) {
    alert('请输入弹窗标题')
    return
  }

  const saveData = { ...form }

  if (editing.value) {
    const { error } = await supabase
      .from('popups')
      .update(saveData)
      .eq('id', editing.value.id)

    if (error) {
      console.error('更新弹窗失败:', error.message)
      return
    }
  } else {
    const { error } = await supabase
      .from('popups')
      .insert(saveData)

    if (error) {
      console.error('创建弹窗失败:', error.message)
      return
    }
  }

  closeDrawer()
  await fetchPopups()
}

async function toggleActive(popup) {
  const newVal = !popup.is_active
  popup.is_active = newVal

  const { error } = await supabase
    .from('popups')
    .update({ is_active: newVal })
    .eq('id', popup.id)

  if (error) {
    console.error('更新状态失败:', error.message)
    popup.is_active = !newVal
  }
}

function confirmDelete(popup) {
  deleteTarget.value = popup
}

async function doDelete() {
  const { error } = await supabase
    .from('popups')
    .delete()
    .eq('id', deleteTarget.value.id)

  if (error) {
    console.error('删除弹窗失败:', error.message)
    return
  }

  deleteTarget.value = null
  await fetchPopups()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
