<template>
  <div class="px-8 pb-12 pt-8 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[60vh]">
    <div class="text-center space-y-4">
      <div class="w-24 h-24 rounded-3xl bg-brand-orange/10 flex items-center justify-center mx-auto text-brand-orange mb-6 shadow-sm">
        <span class="material-symbols-outlined text-5xl">inventory_2</span>
      </div>
      <h2 class="text-3xl font-bold text-dark-brown">欢迎来到薯鲜生商户台</h2>
      <p class="text-dark-brown/70">在左侧菜单选择相应功能以开始管理您的店铺数据与商品。</p>
      
      <router-link to="/data" class="inline-block mt-4 px-6 py-3 rounded-2xl bg-brand-orange text-white text-sm font-medium hover:bg-[#a85522] transition-colors shadow-sm">
        查看数据概览
      </router-link>
    </div>
  </div>
</template>
