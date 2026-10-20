<template>
  <div class="fixed inset-0 z-[9999] pointer-events-none">
    <div class="fixed top-4 right-4 space-y-2 max-w-sm">
      <transition-group name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto animate-slide-in"
          :class="toastClasses(toast.type)"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <span v-if="toast.type === 'success'" class="text-lg">✅</span>
              <span v-else-if="toast.type === 'error'" class="text-lg">❌</span>
              <span v-else-if="toast.type === 'warning'" class="text-lg">⚠️</span>
              <span v-else class="text-lg">ℹ️</span>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">
                {{ toast.message }}
              </p>
            </div>
            <button
              @click="removeToast(toast.id)"
              class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">Yopish</span>
              <span class="text-lg">×</span>
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const toasts = ref([])
let toastId = 0

const show = (options) => {
  const id = ++toastId
  const toast = {
    id,
    message: options.message,
    type: options.type || 'info',
    duration: options.duration || 3000
  }

  toasts.value.push(toast)

  // Auto remove
  if (toast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, toast.duration)
  }

  return id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

const clearAll = () => {
  toasts.value = []
}

const toastClasses = (type) => {
  const classes = {
    success: 'bg-success-50 border border-success-200',
    error: 'bg-danger-50 border border-danger-200',
    warning: 'bg-warning-50 border border-warning-200',
    info: 'bg-primary-50 border border-primary-200'
  }
  return `${classes[type]} p-4 rounded-lg shadow-lg`
}

// Expose methods
defineExpose({
  show,
  removeToast,
  clearAll
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>