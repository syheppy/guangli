<template>
  <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8 flex flex-col h-full min-h-[600px] relative">
    <!-- Action Bar -->
    <div class="flex justify-between items-center mb-8">
      <h3 class="text-[20px] font-semibold text-on-surface">全部商品</h3>
      <div class="flex items-center gap-4 ml-8 flex-1">
        <div class="relative flex-1 max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant opacity-60">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索商品名称..."
            class="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-[14px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div class="relative min-w-[140px]">
          <select
            v-model="categoryFilter"
            class="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2 text-[14px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10"
          >
            <option value="all">全部</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
          </select>
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
        </div>
        <button
          @click="showCategoryManager = true"
          class="flex items-center gap-1.5 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-[12px] tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors shrink-0"
        >
          <span class="material-symbols-outlined text-[18px]">category</span>
          管理分类
        </button>
        <button class="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-full text-[12px] tracking-wide border border-red-100 hover:bg-red-100 transition-colors shrink-0">
          <span class="material-symbols-outlined text-[18px]">warning</span>
          库存预警
        </button>
      </div>
      <button
        @click="openAddDrawer"
        class="bg-primary text-on-primary px-6 py-2.5 rounded-full text-[12px] tracking-wide hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        发布商品
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <span class="material-symbols-outlined text-[40px] text-primary animate-spin">progress_activity</span>
    </div>

    <!-- Data Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="text-on-surface-variant text-[12px] tracking-wide border-b border-surface-container-highest">
            <th class="pb-4 font-medium pl-4">商品信息</th>
            <th class="pb-4 font-medium">分类</th>
            <th class="pb-4 font-medium">库存数量</th>
            <th class="pb-4 font-medium">当前价格</th>
            <th class="pb-4 font-medium">状态</th>
            <th class="pb-4 font-medium">首页展示</th>
            <th class="pb-4 font-medium pr-4">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-container-highest/50">
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            class="hover:bg-surface-bright transition-colors group"
          >
            <td class="py-[18px] pl-4">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-container-low">
                  <img :alt="product.name" class="w-full h-full object-cover" :src="product.image" />
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[16px] font-medium text-on-surface">「{{ product.name }}」</span>
                  <span class="text-[12px] tracking-wide text-on-surface-variant">{{ product.subtitle }}</span>
                </div>
              </div>
            </td>
            <td class="py-[18px]">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {{ product.category }}
              </span>
            </td>
            <td class="py-[18px]">
              <span
                class="text-[14px]"
                :class="product.stock <= 10 ? 'text-error font-medium' : 'text-on-surface'"
              >{{ product.stock }}</span>
            </td>
            <td class="py-[18px]">
              <span class="text-[16px] font-medium text-primary">¥{{ product.price.toFixed(1) }}</span>
            </td>
            <td class="py-[18px]">
              <button
                @click="toggleStatus(product)"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="product.active ? 'bg-primary' : 'bg-surface-container-highest'"
              >
                <span
                  class="inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm"
                  :class="product.active ? 'translate-x-6' : 'translate-x-1'"
                ></span>
              </button>
            </td>
            <td class="py-[18px]">
              <div class="flex items-center gap-2">
                <button
                  @click="toggleHot(product)"
                  class="px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors"
                  :class="product.is_hot ? 'bg-error/10 text-error border-error/30' : 'bg-transparent text-on-surface-variant border-outline-variant hover:border-error/30'"
                >🔥 热销</button>
                <button
                  @click="toggleRecommended(product)"
                  class="px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors"
                  :class="product.is_recommended ? 'bg-primary/10 text-primary border-primary/30' : 'bg-transparent text-on-surface-variant border-outline-variant hover:border-primary/30'"
                >⭐ 推荐</button>
              </div>
            </td>
            <td class="py-[18px] pr-4">
              <div class="flex items-center gap-3">
                <button @click="openEditDrawer(product)" class="text-secondary hover:text-primary text-[12px] tracking-wide transition-colors">编辑</button>
                <button @click="confirmDelete(product)" class="text-secondary hover:text-error text-[12px] tracking-wide transition-colors">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Product Drawer -->
    <ProductDrawer
      v-model:visible="drawerVisible"
      :product="editingProduct"
      @save="onDrawerSave"
    />

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="deleteTarget" class="fixed inset-0 bg-black/20 z-[60] flex items-center justify-center" @click.self="deleteTarget = null">
          <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8 w-[400px] flex flex-col gap-6">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-error text-[28px]">warning</span>
              <h3 class="text-[20px] font-semibold text-on-surface">确认删除</h3>
            </div>
            <p class="text-[14px] text-on-surface-variant leading-relaxed">
              确定要删除「{{ deleteTarget.name }}」吗？此操作无法撤销。
            </p>
            <div class="flex gap-4 justify-end">
              <button
                @click="deleteTarget = null"
                class="px-6 py-2.5 rounded-full text-[14px] font-medium text-secondary hover:bg-surface-container-low transition-colors border border-outline-variant"
              >取消</button>
              <button
                @click="doDelete"
                class="px-6 py-2.5 rounded-full text-[14px] font-medium bg-error text-on-error hover:opacity-90 transition-opacity shadow-sm"
              >确认删除</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Category Manager Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showCategoryManager" class="fixed inset-0 bg-black/20 z-[60] flex items-center justify-center" @click.self="showCategoryManager = false">
          <div class="bg-surface-container-lowest rounded-[24px] cream-shadow w-[440px] max-h-[80vh] flex flex-col overflow-hidden">
            <!-- Header -->
            <div class="px-8 pt-8 pb-5 border-b border-outline-variant/20 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary text-[24px]">category</span>
                <h3 class="text-[20px] font-semibold text-on-surface">管理商品分类</h3>
              </div>
              <button @click="showCategoryManager = false" class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-container-high transition-colors">
                <span class="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <!-- Add Category -->
            <div class="px-8 py-5 border-b border-outline-variant/10">
              <div class="flex gap-3">
                <input
                  v-model="newCategoryName"
                  type="text"
                  placeholder="输入新分类名称"
                  class="flex-1 px-4 py-2.5 rounded-xl border border-[#ECE6DC] bg-white text-[#3A302A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] transition-all text-[14px]"
                  @keyup.enter="handleAddCategory"
                />
                <button
                  @click="handleAddCategory"
                  class="px-5 py-2.5 rounded-full bg-primary text-on-primary text-[13px] font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
                >
                  <span class="material-symbols-outlined text-[18px]">add</span>
                  添加
                </button>
              </div>
              <p v-if="categoryError" class="text-error text-[12px] mt-2">{{ categoryError }}</p>
              <p v-if="categorySuccess" class="text-[#2E7D32] text-[12px] mt-2">{{ categorySuccess }}</p>
            </div>

            <!-- Category List -->
            <div class="flex-1 overflow-y-auto px-8 py-4">
              <div v-if="categories.length > 0" class="flex items-center gap-3 px-3 pb-2 text-[11px] text-on-surface-variant tracking-wide">
                <span class="w-8 text-center shrink-0">图标</span>
                <span class="flex-1">分类名</span>
                <span class="w-20 text-center shrink-0">横幅图</span>
                <span class="w-8 shrink-0"></span>
              </div>
              <div v-if="categories.length === 0" class="flex flex-col items-center justify-center py-8">
                <span class="material-symbols-outlined text-3xl text-on-surface-variant/20 mb-2">category</span>
                <p class="text-on-surface-variant/40 text-[14px]">暂无分类</p>
              </div>
              <div v-else class="space-y-2">
                <div
                  v-for="(cat, index) in categories"
                  :key="cat.id"
                  class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/50 border border-outline-variant/10 group"
                >
                  <!-- 侧边栏图标 -->
                  <div class="relative w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest shrink-0">
                    <img v-if="cat.icon_url" :src="cat.icon_url" class="w-full h-full object-cover" />
                    <span v-else class="material-symbols-outlined text-[14px] text-on-surface-variant/30 absolute inset-0 flex items-center justify-center">category</span>
                    <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="e => uploadCategoryIcon(cat, e)" />
                    <div v-if="cat._iconUploading" class="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span class="material-symbols-outlined text-[12px] text-primary animate-spin">progress_activity</span>
                    </div>
                  </div>
                  <span class="text-[14px] text-on-surface font-medium flex-1">{{ cat.name }}</span>
                  <!-- 横幅缩略图 -->
                  <div class="relative w-20 h-12 rounded-lg overflow-hidden bg-surface-container-highest shrink-0">
                    <img v-if="cat.banner_url" :src="cat.banner_url" class="w-full h-full object-cover" />
                    <span v-else class="material-symbols-outlined text-[16px] text-on-surface-variant/30 absolute inset-0 flex items-center justify-center">image</span>
                    <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="e => uploadCategoryBanner(cat, e)" />
                    <div v-if="cat._uploading" class="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span class="material-symbols-outlined text-[16px] text-primary animate-spin">progress_activity</span>
                    </div>
                  </div>
                  <button
                    @click="handleDeleteCategory(cat)"
                    class="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-all shrink-0"
                  >
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
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
import ProductDrawer from '../components/ProductDrawer.vue'
import { useCategories } from '../composables/useCategories.js'

const { categories, fetchCategories, addCategory, deleteCategory } = useCategories()

const searchQuery = ref('')
const categoryFilter = ref('all')
const drawerVisible = ref(false)
const editingProduct = ref(null)
const deleteTarget = ref(null)
const loading = ref(true)
const products = ref([])

// 分类管理
const showCategoryManager = ref(false)
const newCategoryName = ref('')
const categoryError = ref('')
const categorySuccess = ref('')

function mapRow(row) {
  const imageUrl = row.image_url || ''
  // 添加时间戳防止浏览器缓存图片
  const cacheBustedUrl = imageUrl ? `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : ''
  return {
    id: row.id,
    name: row.name,
    subtitle: row.description,
    category: row.category,
    stock: row.stock,
    price: Number(row.price),
    active: row.status,
    is_hot: row.is_hot || false,
    is_recommended: row.is_recommended || false,
    image: cacheBustedUrl,
  }
}

async function fetchProducts() {
  loading.value = true
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('拉取商品列表失败:', error.message)
  } else {
    products.value = data.map(mapRow)
  }
  loading.value = false
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})

// ============ 分类管理 ============
async function handleAddCategory() {
  const name = newCategoryName.value.trim()
  if (!name) {
    categoryError.value = '请输入分类名称'
    return
  }

  categoryError.value = ''
  categorySuccess.value = ''

  const { error } = await addCategory(name)

  if (error) {
    categoryError.value = error.code === '23505' ? '该分类已存在' : `添加失败：${error.message}`
  } else {
    categorySuccess.value = `「${name}」添加成功`
    newCategoryName.value = ''
    setTimeout(() => { categorySuccess.value = '' }, 2000)
  }
}

async function handleDeleteCategory(cat) {
  if (!confirm(`确定删除分类「${cat.name}」吗？`)) return
  const { error } = await deleteCategory(cat.id)
  if (error) {
    alert(`删除失败：${error.message}`)
  }
}

async function uploadCategoryBanner(cat, event) {
  const file = event.target.files?.[0]
  if (!file) return

  cat._uploading = true

  const ext = file.name.split('.').pop()
  const fileName = `banners/category-${cat.id}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (uploadError) {
    alert('上传失败：' + uploadError.message)
    cat._uploading = false
    return
  }

  const { data } = supabase.storage.from('products').getPublicUrl(fileName)

  const { error: updateError } = await supabase.from('categories').update({ banner_url: data.publicUrl }).eq('id', cat.id)

  if (updateError) {
    alert('保存失败：' + updateError.message)
  } else {
    cat.banner_url = data.publicUrl
  }

  cat._uploading = false
  event.target.value = ''
}

async function uploadCategoryIcon(cat, event) {
  const file = event.target.files?.[0]
  if (!file) return

  cat._iconUploading = true

  const ext = file.name.split('.').pop()
  const fileName = `icons/category-${cat.id}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (uploadError) {
    alert('上传失败：' + uploadError.message)
    cat._iconUploading = false
    return
  }

  const { data } = supabase.storage.from('products').getPublicUrl(fileName)

  const { error: updateError } = await supabase.from('categories').update({ icon_url: data.publicUrl }).eq('id', cat.id)

  if (updateError) {
    alert('保存失败：' + updateError.message)
  } else {
    cat.icon_url = data.publicUrl
  }

  cat._iconUploading = false
  event.target.value = ''
}

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchSearch = p.name.includes(searchQuery.value)
    const matchCategory = categoryFilter.value === 'all' || p.category === categoryFilter.value
    return matchSearch && matchCategory
  })
})

function openAddDrawer() {
  editingProduct.value = null
  drawerVisible.value = true
}

function openEditDrawer(product) {
  editingProduct.value = { ...product }
  drawerVisible.value = true
}

async function onDrawerSave(data) {
  if (data.id) {
    const { error } = await supabase
      .from('products')
      .update({
        name: data.name,
        category: data.category,
        price: Number(data.price),
        stock: Number(data.stock),
        description: data.subtitle || data.description || '',
        image_url: data.image_url || '',
      })
      .eq('id', data.id)

    if (error) {
      console.error('更新商品失败:', error.message)
      return
    }
  } else {
    const { error } = await supabase
      .from('products')
      .insert({
        name: data.name,
        category: data.category,
        price: Number(data.price),
        stock: Number(data.stock),
        status: true,
        description: data.subtitle || data.description || '',
        image_url: data.image_url || '',
      })

    if (error) {
      console.error('新增商品失败:', error.message)
      return
    }
  }

  drawerVisible.value = false
  await fetchProducts()
}

async function toggleStatus(product) {
  const newStatus = !product.active
  product.active = newStatus

  const { error } = await supabase
    .from('products')
    .update({ status: newStatus })
    .eq('id', product.id)

  if (error) {
    console.error('更新状态失败:', error.message)
    product.active = !newStatus
  }
}

async function toggleHot(product) {
  const newVal = !product.is_hot
  product.is_hot = newVal
  const { error } = await supabase.from('products').update({ is_hot: newVal }).eq('id', product.id)
  if (error) {
    console.error('更新热销失败:', error.message)
    product.is_hot = !newVal
  }
}

async function toggleRecommended(product) {
  const newVal = !product.is_recommended
  product.is_recommended = newVal
  const { error } = await supabase.from('products').update({ is_recommended: newVal }).eq('id', product.id)
  if (error) {
    console.error('更新推荐失败:', error.message)
    product.is_recommended = !newVal
  }
}

function confirmDelete(product) {
  deleteTarget.value = product
}

async function doDelete() {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', deleteTarget.value.id)

  if (error) {
    console.error('删除商品失败:', error.message)
    return
  }

  deleteTarget.value = null
  await fetchProducts()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
