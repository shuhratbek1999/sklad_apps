<template>
  <div
    :class="[
      'animate-spin rounded-full border-2 border-current border-t-transparent',
      sizeClasses,
      colorClasses
    ]"
    :style="style"
    role="status"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'white', 'gray', 'success', 'danger'].includes(value)
  },
  thickness: {
    type: Number,
    default: 2
  }
})

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  const colors = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-success-600',
    danger: 'text-danger-600'
  }
  return colors[props.color]
})

const style = computed(() => ({
  borderWidth: `${props.thickness}px`
}))
</script>