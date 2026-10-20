<template>
  <div class="cursor-pointer hover:shadow-lg transition-shadow duration-300" @click="handleClick">
    <div class="relative w-full overflow-hidden rounded-md">
      <div class="aspect-square min-h-60 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <img :src="getImageUrl(product.image_url)" class="w-full h-full object-cover" />
      </div>
      <!-- <img v-if="product.image_url" :src="getImageUrl(product.image_url)" :alt="product.name"
        class="w-full h-full object-cover" @error="handleImageError" />
        
      <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
        <span class="text-gray-400 text-6xl">📦</span>
      </div> -->
      <div class="absolute top-3 right-3 p-2">
        <span :class="[
          'badge',
          product.quantity === 0 ? 'badge-danger' :
            product.quantity < 10 ? 'badge-warning' : 'badge-success'
        ]">
          {{ product.quantity }}
        </span>
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-base font-semibold text-gray-900 mb-1 truncate" :title="product.name">
        {{ product }}
      </h3>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { formatCurrency } from '@/utils/formatters'
import { useImageUpload } from '@/composables/useImageUpload'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const { getImageUrl } = useImageUpload()

const emit = defineEmits(['click'])

const handleClick = () => {
  console.log('ProductCard clicked:', props.product.id, props.product.name)
  emit('click', props.product)
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = `
    <div class="w-full h-full bg-gray-100 flex items-center justify-center">
      <span class="text-gray-400 text-6xl">📦</span>
    </div>
  `
}
</script>

<style scoped>
.badge {
  @apply px-2 py-1 rounded-full text-xs font-semibold;
}

.badge-success {
  @apply bg-success-100 text-success-800;
}

.badge-warning {
  @apply bg-warning-100 text-warning-800;
}

.badge-danger {
  @apply bg-danger-100 text-danger-800;
}
</style>