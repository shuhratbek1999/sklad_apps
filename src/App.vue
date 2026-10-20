<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <AppHeader v-if="showHeader" />
    <main :class="['pt-16', hasSidebar ? 'lg:pl-64' : '']">
      <div :class="['min-h-[calc(100vh-4rem)]', hasSidebar ? 'lg:pr-4' : 'container-padding']">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    <AppSidebar v-if="hasSidebar" />
    <BottomNav v-if="showBottomNav" />
    <ToastContainer />
  </div>  
</template>

<script setup>  
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/Header.vue'
import AppSidebar from '@/components/layout/Sidebar.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import ToastContainer from '@/plugins/ToastContainer.vue'

const route = useRoute()

const showHeader = computed(() => !route.meta.hideHeader)
const showBottomNav = computed(() => !route.meta.hideBottomNav)
const hasSidebar = computed(() => route.meta.hasSidebar)
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>