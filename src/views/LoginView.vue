<template>
  <div class="min-h-screen bg-surface-container-low flex items-center justify-center px-4">
    <div class="w-full max-w-[400px]">
      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-primary text-[32px]">admin_panel_settings</span>
        </div>
        <h1 class="text-[24px] font-bold text-on-surface">薯鲜生管理后台</h1>
        <p class="text-[14px] text-on-surface-variant mt-2">请登录以继续</p>
      </div>

      <!-- 登录表单 -->
      <div class="bg-surface-container-lowest rounded-[24px] cream-shadow p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-2">
            <label class="block text-[14px] font-medium text-on-surface">邮箱</label>
            <input
              v-model="email"
              type="email"
              placeholder="请输入邮箱"
              required
              class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px]"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-[14px] font-medium text-on-surface">密码</label>
            <input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              required
              class="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px]"
            />
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMsg" class="flex items-center gap-2 p-3 rounded-xl bg-error/10 text-error text-[13px]">
            <span class="material-symbols-outlined text-[18px]">error</span>
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="w-full py-3 rounded-full bg-primary text-on-primary text-[14px] font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span v-if="submitting" class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            {{ submitting ? '登录中...' : '登录' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const submitting = ref(false)

async function handleLogin() {
  errorMsg.value = ''
  submitting.value = true

  const { error } = await signIn(email.value, password.value)

  if (error) {
    errorMsg.value = error.message === 'Invalid login credentials'
      ? '邮箱或密码错误'
      : error.message
    submitting.value = false
    return
  }

  router.push('/')
}
</script>
