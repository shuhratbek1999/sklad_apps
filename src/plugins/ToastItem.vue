<template>
  <div
    :class="[
      'rounded-lg shadow-lg border overflow-hidden min-w-[300px] max-w-md',
      'transform transition-transform duration-200 hover:scale-[1.02]',
      toastClasses,
      clickableClasses
    ]"
    @click="handleClick"
  >
    <!-- Progress Bar -->
    <div
      v-if="toast.duration > 0"
      class="h-1 w-full"
      :class="progressBarClasses"
    >
      <div
        ref="progressBar"
        class="h-full transition-all duration-300 ease-linear"
        :class="progressBarFillClasses"
      />
    </div>
    
    <!-- Toast Content -->
    <div class="p-4">
      <div class="flex items-start">
        <!-- Icon -->
        <div class="flex-shrink-0 mr-3">
          <div :class="iconContainerClasses">
            <span class="text-lg">{{ toastIcon }}</span>
          </div>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div v-if="toast.title" class="flex items-start justify-between">
            <h4 class="text-sm font-semibold" :class="titleClasses">
              {{ toast.title }}
            </h4>
            <button
              v-if="toast.showClose"
              @click.stop="$emit('close')"
              class="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <span class="sr-only">Yopish</span>
              <span class="text-lg">×</span>
            </button>
          </div>
          
          <p class="text-sm mt-1" :class="messageClasses">
            {{ toast.message }}
          </p>
          
          <!-- Action Button -->
          <button
            v-if="toast.action"
            @click.stop="handleAction"
            class="mt-2 text-sm font-medium"
            :class="actionClasses"
          >
            {{ toast.actionLabel || 'Batafsil' }}
          </button>
        </div>
        
        <!-- Close Button (if no title) -->
        <button
          v-if="toast.showClose && !toast.title"
          @click.stop="$emit('close')"
          class="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <span class="sr-only">Yopish</span>
          <span class="text-lg">×</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  toast: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const progressBar = ref(null)
let progressInterval = null
const progress = ref(100)

const toastIcon = computed(() => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    loading: '⏳'
  }
  return icons[props.toast.type] || '📢'
})

const toastClasses = computed(() => {
  const base = 'bg-white dark:bg-gray-800'
  const borders = {
    success: 'border-success-200 dark:border-success-800',
    error: 'border-danger-200 dark:border-danger-800',
    warning: 'border-warning-200 dark:border-warning-800',
    info: 'border-primary-200 dark:border-primary-800',
    loading: 'border-gray-200 dark:border-gray-700'
  }
  return `${base} ${borders[props.toast.type] || borders.info}`
})

const iconContainerClasses = computed(() => {
  const classes = {
    success: 'text-success-600',
    error: 'text-danger-600',
    warning: 'text-warning-600',
    info: 'text-primary-600',
    loading: 'text-gray-600 dark:text-gray-400'
  }
  return classes[props.toast.type] || classes.info
})

const titleClasses = computed(() => {
  const classes = {
    success: 'text-success-800 dark:text-success-200',
    error: 'text-danger-800 dark:text-danger-200',
    warning: 'text-warning-800 dark:text-warning-200',
    info: 'text-primary-800 dark:text-primary-200',
    loading: 'text-gray-900 dark:text-gray-100'
  }
  return classes[props.toast.type] || classes.info
})

const messageClasses = computed(() => {
  const classes = {
    success: 'text-success-700 dark:text-success-300',
    error: 'text-danger-700 dark:text-danger-300',
    warning: 'text-warning-700 dark:text-warning-300',
    info: 'text-primary-700 dark:text-primary-300',
    loading: 'text-gray-700 dark:text-gray-300'
  }
  return classes[props.toast.type] || classes.info
})

const progressBarClasses = computed(() => {
  const classes = {
    success: 'bg-success-100 dark:bg-success-900/30',
    error: 'bg-danger-100 dark:bg-danger-900/30',
    warning: 'bg-warning-100 dark:bg-warning-900/30',
    info: 'bg-primary-100 dark:bg-primary-900/30',
    loading: 'bg-gray-100 dark:bg-gray-700'
  }
  return classes[props.toast.type] || classes.info
})

const progressBarFillClasses = computed(() => {
  const classes = {
    success: 'bg-success-500',
    error: 'bg-danger-500',
    warning: 'bg-warning-500',
    info: 'bg-primary-500',
    loading: 'bg-gray-400'
  }
  return classes[props.toast.type] || classes.info
})

const actionClasses = computed(() => {
  const classes = {
    success: 'text-success-600 hover:text-success-800 dark:text-success-400 dark:hover:text-success-300',
    error: 'text-danger-600 hover:text-danger-800 dark:text-danger-400 dark:hover:text-danger-300',
    warning: 'text-warning-600 hover:text-warning-800 dark:text-warning-400 dark:hover:text-warning-300',
    info: 'text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300',
    loading: 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300'
  }
  return classes[props.toast.type] || classes.info
})

const clickableClasses = computed(() => {
  return props.toast.onClick ? 'cursor-pointer' : ''
})

const handleClick = () => {
  if (props.toast.onClick) {
    props.toast.onClick(props.toast)
  }
}

const handleAction = (event) => {
  event.stopPropagation()
  if (props.toast.action) {
    props.toast.action(props.toast)
  }
}

const startProgress = () => {
  if (props.toast.duration <= 0) return
  
  const duration = props.toast.duration
  const interval = 50
  const steps = duration / interval
  
  progressInterval = setInterval(() => {
    progress.value -= 100 / steps
    if (progressBar.value) {
      progressBar.value.style.width = `${progress.value}%`
    }
    
    if (progress.value <= 0) {
      clearInterval(progressInterval)
    }
  }, interval)
}

const stopProgress = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

onMounted(() => {
  if (props.toast.duration > 0) {
    startProgress()
  }
})

onUnmounted(() => {
  stopProgress()
})
</script>