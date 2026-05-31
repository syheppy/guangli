import { ref } from 'vue'
import { supabase } from '../utils/supabase.js'

const categories = ref([])
const loading = ref(false)

async function fetchCategories() {
  loading.value = true
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (!error) {
    categories.value = data || []
  }
  loading.value = false
}

async function addCategory(name) {
  const maxOrder = categories.value.reduce((max, c) => Math.max(max, c.sort_order || 0), 0)
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, sort_order: maxOrder + 1 })
    .select()
    .single()

  if (!error && data) {
    categories.value.push(data)
  }
  return { data, error }
}

async function deleteCategory(id) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (!error) {
    categories.value = categories.value.filter(c => c.id !== id)
  }
  return { error }
}

export function useCategories() {
  return { categories, loading, fetchCategories, addCategory, deleteCategory }
}
