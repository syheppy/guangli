<template>
  <div class="space-y-6">
    <!-- 页面标题 + 添加按钮 -->
    <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8 flex items-center justify-between">
      <div>
        <h2 class="text-[28px] font-bold text-on-surface">首页横幅管理</h2>
        <p class="text-[14px] text-on-surface-variant mt-2">管理 APP 首页展示的横幅广告</p>
      </div>
      <button
        @click="openAdd"
        class="bg-primary text-on-primary px-6 py-2.5 rounded-full text-[12px] tracking-wide hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        添加横幅
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
    </div>

    <!-- 横幅列表 -->
    <div v-else-if="banners.length === 0" class="bg-surface-container-lowest rounded-[24px] cream-shadow p-16 flex flex-col items-center">
      <span class="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4">image</span>
      <p class="text-on-surface-variant/50 text-[14px]">暂无横幅，点击上方按钮添加</p>
    </div>

    <div v-else class="space-y-4">
      <draggable
        v-model="banners"
        item-key="id"
        handle=".drag-handle"
        ghost-class="opacity-50"
        @end="onDragEnd"
      >
        <template #item="{ element: banner }">
          <div class="bg-surface-container-lowest rounded-[24px] cream-shadow overflow-hidden flex mb-4">
            <!-- 拖拽手柄 -->
            <div class="w-10 shrink-0 flex items-center justify-center bg-surface-container-low cursor-grab drag-handle">
              <span class="material-symbols-outlined text-on-surface-variant/40">drag_indicator</span>
            </div>
            <!-- 图片预览 -->
            <div class="w-80 h-48 shrink-0 bg-surface-container-low">
              <img :src="banner.image_url" class="w-full h-full object-cover" />
            </div>
            <!-- 信息 -->
            <div class="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span v-if="banner.tag" class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">{{ banner.tag }}</span>
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                    :class="banner.is_active ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-surface-container-highest text-on-surface-variant'"
                  >{{ banner.is_active ? '展示中' : '已隐藏' }}</span>
                </div>
                <h3 class="text-[18px] font-semibold text-on-surface">{{ banner.title }}</h3>
                <p class="text-[13px] text-on-surface-variant mt-1">{{ banner.subtitle }}</p>
              </div>
              <div class="flex items-center gap-3">
                <button
                  @click="toggleActive(banner)"
                  class="px-4 py-2 rounded-full text-[12px] font-medium border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >{{ banner.is_active ? '隐藏' : '展示' }}</button>
                <button
                  @click="openEdit(banner)"
                  class="px-4 py-2 rounded-full text-[12px] font-medium text-primary hover:bg-primary/5 transition-colors"
                >编辑</button>
                <button
                  @click="handleDelete(banner)"
                  class="px-4 py-2 rounded-full text-[12px] font-medium text-error hover:bg-error/5 transition-colors"
                >删除</button>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- 编辑/添加弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="editVisible" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center" @click.self="editVisible = false">
          <div class="bg-surface-container-lowest rounded-[28px] cream-shadow w-[560px] max-h-[85vh] flex flex-col overflow-hidden">
            <!-- 弹窗头部 -->
            <div class="px-8 pt-8 pb-5 border-b border-outline-variant/20 flex items-center justify-between">
              <h3 class="text-[20px] font-semibold text-on-surface">{{ editingBanner ? '编辑横幅' : '添加横幅' }}</h3>
              <button @click="editVisible = false" class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-container-high transition-colors">
                <span class="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <!-- 表单 -->
            <div class="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <!-- 图片上传 -->
              <div class="space-y-2">
                <label class="block text-[14px] font-medium text-on-surface">横幅图片</label>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelected" />
                <div v-if="form.image_url" class="relative rounded-2xl overflow-hidden border border-outline-variant group">
                  <img :src="form.image_url" class="w-full h-48 object-cover" />
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button @click="fileInput.click()" class="px-4 py-2 bg-white/90 rounded-full text-[12px] font-medium text-[#3A302A] hover:bg-white transition-colors shadow-sm">重新上传</button>
                      <button @click="form.image_url = ''" class="px-4 py-2 bg-white/90 rounded-full text-[12px] font-medium text-error hover:bg-white transition-colors shadow-sm">删除</button>
                    </div>
                  </div>
                  <div v-if="uploading" class="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span class="material-symbols-outlined text-[32px] text-primary animate-spin">progress_activity</span>
                  </div>
                </div>
                <div v-else @click="fileInput.click()" class="border-2 border-dashed border-outline-variant rounded-2xl h-40 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <span v-if="uploading" class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                  <template v-else>
                    <span class="material-symbols-outlined text-4xl text-on-surface-variant/40">add</span>
                    <span class="text-[12px] text-on-surface-variant/60">点击上传横幅图片</span>
                  </template>
                </div>
              </div>

              <!-- 标签 -->
              <div class="space-y-2">
                <label class="block text-[14px] font-medium text-on-surface">角标文字</label>
                <input v-model="form.tag" type="text" placeholder="如：新季丰收、限时特惠" class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px]" />
              </div>

              <!-- 标题 -->
              <div class="space-y-2">
                <label class="block text-[14px] font-medium text-on-surface">主标题</label>
                <input v-model="form.title" type="text" placeholder="如：大地甄选 直送到家" class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px]" />
              </div>

              <!-- 副标题 -->
              <div class="space-y-2">
                <label class="block text-[14px] font-medium text-on-surface">副标题</label>
                <input v-model="form.subtitle" type="text" placeholder="如：从田间直达餐桌，锁住每一份自然的甜蜜" class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px]" />
              </div>
            </div>

            <!-- 底部按钮 -->
            <div class="px-8 py-6 border-t border-outline-variant/20 flex gap-4 justify-end">
              <button @click="editVisible = false" class="px-6 py-2.5 rounded-full text-[14px] font-medium text-secondary hover:bg-surface-container-low transition-colors border border-outline-variant">取消</button>
              <button @click="handleSave" :disabled="!form.image_url" class="px-6 py-2.5 rounded-full text-[14px] font-medium bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50">保存</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase.js'
import imageCompression from 'browser-image-compression'
import draggable from 'vuedraggable'

const loading = ref(true)
const banners = ref([])
const editVisible = ref(false)
const editingBanner = ref(null)
const uploading = ref(false)
const fileInput = ref(null)

const emptyForm = () => ({ image_url: '', tag: '', title: '', subtitle: '' })
const form = ref(emptyForm())

onMounted(fetchBanners)

async function fetchBanners() {
  loading.value = true
  const { data, error } = await supabase.from('banners').select('*').order('sort_order')
  if (!error) banners.value = data || []
  loading.value = false
}

function openAdd() {
  editingBanner.value = null
  form.value = emptyForm()
  editVisible.value = true
}

function openEdit(banner) {
  editingBanner.value = banner
  form.value = { image_url: banner.image_url, tag: banner.tag || '', title: banner.title || '', subtitle: banner.subtitle || '' }
  editVisible.value = true
}

async function onFileSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value = true

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 10,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      initialQuality: 0.7,
      fileType: 'image/webp',
    })

    const fileName = `banners/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`

    const { error: uploadError } = await supabase.storage.from('products').upload(fileName, compressedFile, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      alert('图片上传失败：' + uploadError.message)
      return
    }

    const { data } = supabase.storage.from('products').getPublicUrl(fileName)
    form.value.image_url = data.publicUrl
  } catch (err) {
    console.error('图片压缩失败:', err.message)
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}

async function handleSave() {
  if (!form.value.image_url) return

  if (editingBanner.value) {
    const { error } = await supabase.from('banners').update({
      image_url: form.value.image_url,
      tag: form.value.tag,
      title: form.value.title,
      subtitle: form.value.subtitle,
    }).eq('id', editingBanner.value.id)

    if (error) { alert('保存失败：' + error.message); return }
  } else {
    const maxOrder = banners.value.reduce((max, b) => Math.max(max, b.sort_order || 0), 0)
    const { error } = await supabase.from('banners').insert({
      image_url: form.value.image_url,
      tag: form.value.tag,
      title: form.value.title,
      subtitle: form.value.subtitle,
      sort_order: maxOrder + 1,
      is_active: true,
    })

    if (error) { alert('保存失败：' + error.message); return }
  }

  editVisible.value = false
  await fetchBanners()
}

async function toggleActive(banner) {
  const { error } = await supabase.from('banners').update({ is_active: !banner.is_active }).eq('id', banner.id)
  if (!error) banner.is_active = !banner.is_active
}

async function handleDelete(banner) {
  if (!confirm(`确定删除横幅「${banner.title}」吗？`)) return
  const { error } = await supabase.from('banners').delete().eq('id', banner.id)
  if (error) { alert('删除失败：' + error.message); return }
  await fetchBanners()
}

async function onDragEnd() {
  for (let i = 0; i < banners.value.length; i++) {
    banners.value[i].sort_order = i + 1
    await supabase.from('banners').update({ sort_order: i + 1 }).eq('id', banners.value[i].id)
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
