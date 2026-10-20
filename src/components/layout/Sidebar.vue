<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
      <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        StoreApp
      </span>
    </div>

    <nav class="p-4 space-y-1 h-[calc(100vh-8rem)] overflow-y-auto">
      <SidebarItem
        v-for="item in navItems"
        :key="item.route"
        :item="item"
        :active="isActive(item.route)"
        @click="closeMobileSidebar"
      />

      <div class="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700">
        <p class="px-2 text-xs font-semibold text-gray-400 uppercase mb-4">Holat</p>
        <div class="space-y-3 px-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Kam zaxira:</span>
            <span class="font-bold text-orange-500">{{ lowStockCount }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Tugagan:</span>
            <span class="font-bold text-red-500">{{ outOfStockCount }}</span>
          </div>
        </div>
      </div>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 text-xs font-bold">
          A
        </div>
        <span class="text-sm font-medium dark:text-gray-200">Admin</span>
      </div>
      
      <button @click="toggleTheme" class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <span v-if="theme === 'light'">🌙</span>
        <span v-else>☀️</span>
      </button>
    </div>
  </aside>

  <div v-if="isSidebarOpen" @click="closeSidebar" class="fixed inset-0 z-30 bg-black/40 lg:hidden"></div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/uiStore'
import { useProductWithStatsStore } from '@/stores/productWithStatsStore' // To'g'ri store
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const uiStore = useUIStore()
const statsStore = useProductWithStatsStore()

// Store'dan reaktiv ma'lumotlarni olish
const { theme, isSidebarOpen } = storeToRefs(uiStore)
const { lowStockCount, outOfStockCount } = storeToRefs(statsStore)
const navItems = [
  { label: 'Bosh sahifa', icon: '🏠', route: '/' },
  { label: 'Mahsulotlar', icon: '📦', route: '/products' },
  { label: 'Hisobotlar', icon: '📊', route: '/reports' },
  { label: 'Sozlamalar', icon: '⚙️', route: '/settings' },
]

const toggleTheme = () => uiStore.toggleTheme()
const closeSidebar = () => uiStore.closeSidebar()
const closeMobileSidebar = () => {
  if (window.innerWidth < 1024) uiStore.closeSidebar()
}
const isActive = (path) => route.path === path
</script>