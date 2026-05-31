<template>
  <div class="flex h-screen overflow-hidden">
    <!-- SideNavBar -->
    <aside class="fixed left-0 top-0 h-full w-64 flex flex-col p-6 space-y-8 bg-white border-r border-[#FAF5EE] z-50 hidden md:flex">
      <!-- Brand -->
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white shadow-sm overflow-hidden">
             <img alt="Logo" class="w-full h-full object-cover rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyvEH4YWED5yXxd6d38O7vh2vnV08wPX4G9gvBve7TqaASs4ZYj-KW-EEbA7ExsGZnm1W3tqR1UUm9mO0XO3NbI1DmSslrpUkAcfWRfHa4TeUPpJo2gsaY4-bEO3iOpDnjd3UWJH3b0V7Trj_OALEHaucTtpjBj3RG4PgV5FN_9vrKZW2g72nRDjWHKO-kbGEEUS1MzyojP0Uj43uC2EJFXwVNlqFCjJ4xR6AUB9ytFFqpZ7auAqGFROCQMiHbM2OwWq3BsYNcbI8" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-brand-orange tracking-tight">薯鲜生</h1>
          <p class="text-xs text-dark-brown/70 font-medium">Merchant Portal</p>
        </div>
      </div>
      
      <!-- Navigation Links -->
      <nav class="flex-1 flex flex-col space-y-2">
        <router-link to="/" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 ease-in-out text-sm"
                     :class="[ $route.path === '/' ? 'text-brand-orange font-bold bg-brand-orange/10' : 'text-dark-brown/80 hover:bg-brand-orange/5 hover:text-brand-orange' ]">
          <span class="material-symbols-outlined" :style="{ fontVariationSettings: $route.path === '/' ? '\'FILL\' 1' : '\'FILL\' 0' }">dashboard</span>
          工作台
        </router-link>
        <router-link to="/products" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 ease-in-out text-sm"
                     :class="[ $route.path.includes('/products') ? 'text-brand-orange font-bold bg-brand-orange/10' : 'text-dark-brown/80 hover:bg-brand-orange/5 hover:text-brand-orange' ]">
          <span class="material-symbols-outlined" :style="{ fontVariationSettings: $route.path.includes('/products') ? '\'FILL\' 1' : '\'FILL\' 0' }">inventory_2</span>
          商品管理
        </router-link>
        <router-link to="/orders" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 ease-in-out text-sm"
                     :class="[ $route.path.includes('/orders') ? 'text-brand-orange font-bold bg-brand-orange/10' : 'text-dark-brown/80 hover:bg-brand-orange/5 hover:text-brand-orange' ]">
          <span class="material-symbols-outlined" :style="{ fontVariationSettings: $route.path.includes('/orders') ? '\'FILL\' 1' : '\'FILL\' 0' }">receipt_long</span>
          订单处理
        </router-link>
        <router-link to="/data" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 ease-in-out text-sm"
                     :class="[ $route.path.includes('/data') ? 'text-brand-orange font-bold bg-brand-orange/10' : 'text-dark-brown/80 hover:bg-brand-orange/5 hover:text-brand-orange' ]">
          <span class="material-symbols-outlined" :style="{ fontVariationSettings: $route.path.includes('/data') ? '\'FILL\' 1' : '\'FILL\' 0' }">leaderboard</span>
          数据中心
        </router-link>
      </nav>
      
      <!-- Footer Action -->
      <div class="mt-auto pt-6 border-t border-[#FAF5EE]">
        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-brown/80 hover:bg-brand-orange/5 hover:text-brand-orange transition-colors duration-150 ease-in-out text-sm">
          <span class="material-symbols-outlined">settings</span>
          设置
        </a>
      </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 md:ml-64 flex flex-col h-full overflow-hidden">
      <!-- TopAppBar -->
      <header class="sticky top-0 z-40 flex justify-between items-center px-8 py-4 bg-[#FAF5EE]/80 backdrop-blur-md">
        <!-- Mobile Brand -->
        <div class="md:hidden">
          <h1 class="text-xl font-bold text-brand-orange">薯鲜生</h1>
        </div>
        <div class="flex-1"></div> <!-- Spacer -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-4">
            <button class="text-dark-brown/80 hover:text-brand-orange transition-all opacity-80 hover:opacity-100 p-2 rounded-full hover:bg-white shadow-sm">
              <span class="material-symbols-outlined">notifications</span>
            </button>
            <button class="text-dark-brown/80 hover:text-brand-orange transition-all opacity-80 hover:opacity-100 p-2 rounded-full hover:bg-white shadow-sm">
              <span class="material-symbols-outlined">help_outline</span>
            </button>
          </div>
          <div class="h-8 w-[1px] bg-outline-variant/30 hidden md:block"></div>
          <div class="flex items-center gap-3 cursor-pointer group ml-2 md:ml-0">
            <div class="w-9 h-9 rounded-full bg-surface-variant overflow-hidden border-2 border-transparent group-hover:border-brand-orange/20 transition-all shadow-sm">
               <img alt="Admin Avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIIIY5wRsbqGsy-XIkm05g2l-GgQv9xp0ObRK4umSjMabV4dRDP2eGW7EPgC-6YVxeW1dkSKSLHSW4pYHaWVdY9TuGBVfwVCRMb0dcpHGlTyPdrtHjqGy2mj78NIDjhbxbma6CJJVNq4vGnk_WQcgg0n-Y8rUaik1NNCkHO1vVpGaaIFI_byy7qh5jx6VYNSxvyW68Wuh3pcumUXSpdShvowpBdtHJtapYqGSbRfuzIfx7y_gbG6uS0Kh2KcnyWjIv6pAg2p_Cwv4" />
            </div>
            <span class="text-sm font-medium text-dark-brown/80 group-hover:text-brand-orange transition-colors hidden md:block">退出登录</span>
          </div>
        </div>
      </header>

      <!-- Canvas Area -->
      <main class="flex-1 overflow-y-auto w-full pt-4">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>