<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 bg-black/20 z-40"
        @click="close"
      ></div>
    </Transition>
    <Transition name="slide">
      <div
        v-if="visible"
        class="fixed right-0 top-0 h-full w-1/3 bg-white z-50 shadow-2xl flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 class="text-[24px] font-semibold text-[#3A302A]">{{ isEdit ? '编辑商品' : '发布新商品' }}</h2>
          <button @click="close" class="p-2 hover:bg-surface-container rounded-full transition-colors">
            <span class="material-symbols-outlined text-[#3A302A]">close</span>
          </button>
        </div>

        <!-- Form Content -->
        <div class="flex-1 overflow-y-auto p-8 space-y-6">
          <!-- 商品名称 -->
          <div class="space-y-2">
            <label class="block font-medium text-[#3A302A]">商品名称</label>
            <input
              v-model="form.name"
              class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
              placeholder="请输入商品名称，如：冰淇淋紫薯"
              type="text"
            />
          </div>

          <!-- 商品分类 -->
          <div class="space-y-2">
            <label class="block font-medium text-[#3A302A]">商品分类</label>
            <div class="relative">
              <select
                v-model="form.category"
                class="w-full appearance-none px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
              >
                <option disabled value="">请选择分类</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#3A302A]">expand_more</span>
            </div>
          </div>

          <!-- 价格和库存 -->
          <div class="grid grid-cols-3 gap-4">
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">价格 (¥)</label>
              <input
                v-model="form.price"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                placeholder="0.00"
                type="number"
              />
            </div>
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">原价 (¥)</label>
              <input
                v-model="form.original_price"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                placeholder="划线价"
                type="number"
              />
            </div>
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">库存</label>
              <input
                v-model="form.stock"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                placeholder="0"
                type="number"
              />
            </div>
          </div>

          <!-- 产地、口感、产品特色 -->
          <div class="grid grid-cols-3 gap-4">
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">产地</label>
              <input
                v-model="form.origin"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                placeholder="如：福建漳浦"
                type="text"
              />
            </div>
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">口感</label>
              <input
                v-model="form.taste"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                placeholder="如：粉糯香甜"
                type="text"
              />
            </div>
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">产品特色</label>
              <input
                v-model="form.feature"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                placeholder="如：甜度爆表"
                type="text"
              />
            </div>
          </div>

          <!-- 评分和评价数 -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">评分</label>
              <input
                v-model="form.rating"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                placeholder="5.0"
                type="number"
                step="0.1"
                min="0"
                max="5"
              />
            </div>
            <div class="space-y-2">
              <label class="block font-medium text-[#3A302A]">评价数</label>
              <input
                v-model="form.review_count"
                class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                placeholder="0"
                type="number"
              />
            </div>
          </div>

          <!-- 规格编辑器 -->
          <div class="space-y-2">
            <label class="block font-medium text-[#3A302A]">规格</label>
            <div class="space-y-2">
              <div
                v-for="(spec, index) in form.specs"
                :key="index"
                class="flex items-center gap-2"
              >
                <input
                  v-model="spec.name"
                  class="flex-1 px-4 py-2.5 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                  placeholder="规格名称，如：3KG/箱"
                  type="text"
                />
                <input
                  v-model="spec.price"
                  class="w-28 px-4 py-2.5 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all"
                  placeholder="价格"
                  type="number"
                />
                <button
                  @click="removeSpec(index)"
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                >
                  <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>
            <button
              @click="addSpec"
              class="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] text-primary hover:bg-primary/10 transition-colors"
            >
              <span class="material-symbols-outlined text-[18px]">add</span>
              添加规格
            </button>
          </div>

          <!-- Image Upload -->
          <div class="space-y-2">
            <label class="block font-medium text-[#3A302A]">商品主图</label>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileSelected"
            />

            <!-- Preview State -->
            <div
              v-if="previewUrl"
              class="relative rounded-2xl overflow-hidden border border-[#ECE6DC] group"
            >
              <img :src="previewUrl" class="w-full h-48 object-cover" />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="fileInput.click()"
                    class="px-4 py-2 bg-white/90 rounded-full text-[12px] font-medium text-[#3A302A] hover:bg-white transition-colors shadow-sm"
                  >重新上传</button>
                  <button
                    @click="removeImage"
                    class="px-4 py-2 bg-white/90 rounded-full text-[12px] font-medium text-error hover:bg-white transition-colors shadow-sm"
                  >删除</button>
                </div>
              </div>
              <!-- Loading Overlay -->
              <div v-if="uploading" class="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span class="material-symbols-outlined text-[32px] text-primary animate-spin">progress_activity</span>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-else
              @click="fileInput.click()"
              class="border-2 border-dashed border-[#ECE6DC] rounded-2xl h-40 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-colors cursor-pointer group"
            >
              <span v-if="uploading" class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
              <template v-else>
                <span class="material-symbols-outlined text-4xl text-[#3A302A]/40 group-hover:text-[#C2652A] transition-colors">add</span>
                <span class="text-[12px] tracking-wide text-[#3A302A]/60">点击上传商品主图</span>
              </template>
            </div>
          </div>

          <!-- 商品详情描述 -->
          <div class="space-y-2">
            <label class="block font-medium text-[#3A302A]">商品详情描述</label>
            <textarea
              v-model="form.description"
              class="w-full px-4 py-3 rounded-xl border border-[#ECE6DC] focus:ring-2 focus:ring-[#C2652A]/20 focus:border-[#C2652A] outline-none transition-all resize-none"
              placeholder="请输入商品详细介绍..."
              rows="4"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-outline-variant bg-white mt-auto flex gap-4">
          <button
            @click="close"
            class="flex-1 py-3 px-6 rounded-full font-medium text-secondary hover:bg-surface-container-low transition-colors border border-[#ECE6DC]"
          >取消</button>
          <button
            @click="onSubmit"
            class="flex-1 py-3 px-6 rounded-full font-medium bg-[#C2652A] text-white hover:opacity-90 transition-opacity shadow-sm"
          >{{ isEdit ? '保存修改' : '确认发布' }}</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, watch, computed, ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase.js'
import { useCategories } from '../composables/useCategories.js'

const { categories, fetchCategories } = useCategories()
onMounted(fetchCategories)

const props = defineProps({
  visible: { type: Boolean, default: false },
  product: { type: Object, default: null },
})
const emit = defineEmits(['update:visible', 'save'])

const isEdit = computed(() => !!props.product)

const fileInput = ref(null)
const uploading = ref(false)
const previewUrl = ref('')

const emptyForm = () => ({
  name: '',
  category: '',
  price: '',
  original_price: '',
  stock: '',
  origin: '',
  taste: '',
  feature: '甜度爆表',
  rating: '5.0',
  review_count: '0',
  specs: [],
  description: '',
  image_url: '',
})

const form = reactive(emptyForm())

watch(() => props.visible, (val) => {
  if (!val) return
  if (props.product) {
    // 解析 specs
    let specs = []
    if (props.product.specs) {
      specs = typeof props.product.specs === 'string'
        ? JSON.parse(props.product.specs)
        : props.product.specs
    }

    Object.assign(form, {
      name: props.product.name || '',
      category: props.product.category || '',
      price: props.product.price ?? '',
      original_price: props.product.original_price ?? '',
      stock: props.product.stock ?? '',
      origin: props.product.origin || '',
      taste: props.product.taste || '',
      feature: props.product.feature || '甜度爆表',
      rating: props.product.rating ?? '5.0',
      review_count: props.product.review_count ?? '0',
      specs: specs.map(s => ({ ...s })),
      description: props.product.description || '',
      image_url: props.product.image_url || '',
    })
    previewUrl.value = props.product.image_url || ''
  } else {
    Object.assign(form, emptyForm())
    previewUrl.value = ''
  }
})

function addSpec() {
  form.specs.push({ name: '', price: '' })
}

function removeSpec(index) {
  form.specs.splice(index, 1)
}

async function onFileSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return

  uploading.value = true

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('products')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (uploadError) {
    console.error('图片上传失败:', uploadError.message)
    uploading.value = false
    return
  }

  const { data } = supabase.storage
    .from('products')
    .getPublicUrl(fileName)

  form.image_url = data.publicUrl
  previewUrl.value = data.publicUrl
  uploading.value = false

  e.target.value = ''
}

function removeImage() {
  form.image_url = ''
  previewUrl.value = ''
}

function close() {
  emit('update:visible', false)
}

function onSubmit() {
  const data = {
    ...form,
    // 处理数值类型
    price: Number(form.price) || 0,
    original_price: form.original_price ? Number(form.original_price) : null,
    stock: Number(form.stock) || 0,
    rating: Number(form.rating) || 5.0,
    review_count: Number(form.review_count) || 0,
    // 过滤空规格
    specs: form.specs.filter(s => s.name && s.price),
  }
  if (props.product) data.id = props.product.id
  emit('save', data)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
