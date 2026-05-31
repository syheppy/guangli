import { ref, computed } from 'vue'
import { supabase } from '../utils/supabase.js'

// ====== 管理员白名单 ======
// 把你的邮箱加到这里，只有这些账号能登录后台
const ADMIN_EMAILS = [
  '3182253682@qq.com',
  // 'admin@example.com',
]

const user = ref(null)
const session = ref(null)
const loading = ref(true)

function isAdmin(email) {
  return ADMIN_EMAILS.includes(email?.toLowerCase())
}

// 初始化：恢复已有 session，但只允许管理员
supabase.auth.getSession().then(({ data }) => {
  const u = data.session?.user ?? null
  if (u && isAdmin(u.email)) {
    session.value = data.session
    user.value = u
  } else {
    // 非管理员的残留 session，直接清掉
    supabase.auth.signOut()
    session.value = null
    user.value = null
  }
  loading.value = false
})

// 监听登录状态变化
supabase.auth.onAuthStateChange((_event, s) => {
  const u = s?.user ?? null
  if (u && !isAdmin(u.email)) {
    // 非管理员登录，拒绝
    supabase.auth.signOut()
    session.value = null
    user.value = null
    return
  }
  session.value = s
  user.value = u
})

const isLoggedIn = computed(() => !!user.value)

async function signIn(email, password) {
  if (!isAdmin(email)) {
    return { data: null, error: { message: '此账号无管理后台访问权限' } }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export function useAuth() {
  return { user, session, loading, isLoggedIn, signIn, signOut }
}
