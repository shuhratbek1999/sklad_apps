<template>
  <div class="fixed inset-0 pointer-events-none z-[9999]">
    <!-- Top Center -->
    <div class="fixed top-4 left-1/2 transform -translate-x-1/2 space-y-2 w-full max-w-sm">
      <transition-group name="toast-slide-down">
        <div
          v-for="toast in topCenterToasts"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <ToastItem
            :toast="toast"
            @close="removeToast(toast.id)"
          />
        </div>
      </transition-group>
    </div>
    
    <!-- Top Right -->
    <div class="fixed top-4 right-4 space-y-2 w-full max-w-sm">
      <transition-group name="toast-slide-left">
        <div
          v-for="toast in topRightToasts"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <ToastItem
            :toast="toast"
            @close="removeToast(toast.id)"
          />
        </div>
      </transition-group>
    </div>
    
    <!-- Bottom Right -->
    <div class="fixed bottom-4 right-4 space-y-2 w-full max-w-sm">
      <transition-group name="toast-slide-left">
        <div
          v-for="toast in bottomRightToasts"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <ToastItem
            :toast="toast"
            @close="removeToast(toast.id)"
          />
        </div>
      </transition-group>
    </div>
    
    <!-- Bottom Center -->
    <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 space-y-2 w-full max-w-sm">
      <transition-group name="toast-slide-up">
        <div
          v-for="toast in bottomCenterToasts"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <ToastItem
            :toast="toast"
            @close="removeToast(toast.id)"
          />
        </div>
      </transition-group>
    </div>
    
    <!-- Bottom Left -->
    <div class="fixed bottom-4 left-4 space-y-2 w-full max-w-sm">
      <transition-group name="toast-slide-right">
        <div
          v-for="toast in bottomLeftToasts"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <ToastItem
            :toast="toast"
            @close="removeToast(toast.id)"
          />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToastItem from './ToastItem.vue'

const toasts = ref([])
let toastId = 0

const show = (options) => {
  const id = ++toastId
  const toast = {
    id,
    message: options.message,
    title: options.title,
    type: options.type || 'info',
    duration: options.duration || 3000,
    position: options.position || 'top-right',
    showClose: options.showClose !== false,
    onClick: options.onClick
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

// Group toasts by position
const topCenterToasts = computed(() => 
  toasts.value.filter(t => t.position === 'top-center')
)

const topRightToasts = computed(() => 
  toasts.value.filter(t => t.position === 'top-right' || (!t.position && !t.position.includes('bottom')))
)

const bottomRightToasts = computed(() => 
  toasts.value.filter(t => t.position === 'bottom-right')
)

const bottomCenterToasts = computed(() => 
  toasts.value.filter(t => t.position === 'bottom-center')
)

const bottomLeftToasts = computed(() => 
  toasts.value.filter(t => t.position === 'bottom-left')
)

// Expose methods
defineExpose({
  show,
  removeToast,
  clearAll
})
</script>

<style scoped>
/* Toast animations */
.toast-slide-down-enter-active,
.toast-slide-down-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-slide-left-enter-active,
.toast-slide-left-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.toast-slide-left-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.toast-slide-right-enter-active,
.toast-slide-right-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.toast-slide-right-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.toast-slide-up-enter-active,
.toast-slide-up-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.toast-slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>