<template>
  <router-link
    :to="item.route"
    :class="[
      'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
      active
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
    ]"
  >
    <span class="mr-3 text-lg">{{ item.icon }}</span>
    <span class="font-medium">{{ item.label }}</span>
    <span v-if="item.badge" class="ml-auto px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
      {{ item.badge }}
    </span>
  </router-link>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})
</script>