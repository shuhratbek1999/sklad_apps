<template>
  <div
    :class="[
      'card',
      { 'card-hover': hoverable },
      { 'cursor-pointer': clickable },
      paddingClass
    ]"
    @click="handleClick"
  >
    <div v-if="$slots.header || title" class="card-header border-b border-gray-200 pb-3 mb-3">
      <div class="flex items-center justify-between">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <slot name="header"></slot>
      </div>
      <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
    </div>
    
    <div class="card-body">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="card-footer border-t border-gray-200 pt-3 mt-3">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  subtitle: String,
  hoverable: Boolean,
  clickable: Boolean,
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['click'])

const paddingClass = computed(() => {
  const padding = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-8'
  }
  return padding[props.padding]
})

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>