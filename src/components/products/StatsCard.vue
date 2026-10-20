<template>
  <div @click="$emit('click')" :class="[
    'stats-card cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
    `stats-card--${color}`
  ]">
    <Card>
      <div class="p-4 sm:p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ title }}</p>
            <div v-if="loading" class="mt-2 h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <p v-else class="text-2xl sm:text-3xl font-bold mt-2">{{ value }}</p>
          </div>
          <div class="text-3xl sm:text-4xl">{{ icon }}</div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/ui/Card.vue'

defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: {
    type: String,
    default: 'primary'
  },
  loading: Boolean
})

defineEmits(['click'])
</script>

<style scoped>
.stats-card--primary {
  @apply border-l-4 border-l-primary-500;
}

.stats-card--success {
  @apply border-l-4 border-l-success-500;
}

.stats-card--warning {
  @apply border-l-4 border-l-warning-500;
}

.stats-card--danger {
  @apply border-l-4 border-l-danger-500;
}
</style>