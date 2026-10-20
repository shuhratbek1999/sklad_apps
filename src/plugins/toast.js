import Toast from '../components/ui/Toast.vue'
import { createApp, h } from 'vue'

let toastInstance = null

export function useToast() {
  const show = (options) => {
    if (!toastInstance) {
      createToastContainer()
    }
    
    toastInstance.show(options)
  }

  const success = (message) => {
    show({
      message,
      type: 'success',
      duration: 3000
    })
  }

  const error = (message) => {
    show({
      message,
      type: 'error',
      duration: 5000
    })
  }

  const warning = (message) => {
    show({
      message,
      type: 'warning',
      duration: 4000
    })
  }

  const info = (message) => {
    show({
      message,
      type: 'info',
      duration: 3000
    })
  }

  return {
    show,
    success,
    error,
    warning,
    info
  }
}

function createToastContainer() {
  const container = document.createElement('div')
  container.id = 'toast-container'
  document.body.appendChild(container)

  const app = createApp({
    render() {
      return h(Toast, {
        ref: 'toast'
      })
    },
    mounted() {
      toastInstance = this.$refs.toast
    }
  })

  app.mount(container)
}

// Plugin sifatida
export default {
  install(app) {
    app.config.globalProperties.$toast = useToast()
    app.provide('toast', useToast())
  }
}