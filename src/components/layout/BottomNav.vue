<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg lg:hidden">
    <div class="container-padding">
      <!-- <div class="flex items-center justify-around h-16">
        <BottomNavItem
          v-for="item in navItems"
          :key="item.name"
          :item="item"
          :active="isActive(item.route)"
        />
      </div> -->
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BottomNavItem from './BottomNavItem.vue'

const route = useRoute()
const router = useRouter()

const navItems = computed(() => {
  return router.getRoutes()
    .filter(route => route.meta?.showInNav)
    .map(route => ({
      name: route.name,
      label: route.meta?.title || route.name,
      icon: route.meta?.icon || '📄',
      route: route.path
    }))
})

const isActive = (routePath) => {
  return route.path === routePath
}
</script>