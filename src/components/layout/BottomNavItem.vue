<template>
  <button
    @click="navigate"
    :class="[
      'flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200',
      active ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
    ]"
  >
    <span class="text-2xl mb-1">{{ item.icon }}</span>
    <span class="text-xs font-medium">{{ item.label }}</span>
    
    <!-- Active indicator -->
    <span
      v-if="active"
      class="absolute top-0 w-12 h-1 bg-primary-600 rounded-b-full"
    ></span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const navigate = () => {
  if (!props.active) {
    router.push(props.item.route)
  }
}
</script>