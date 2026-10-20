import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const sidebarOpen = ref(false)
  const notificationsOpen = ref(false)
  const theme = ref('light') 
  const language = ref('uz') 
  const notifications = ref([])
  const toastQueue = ref([])
  const loading = ref(false)
  const mobileMenuOpen = ref(false)

  const isSidebarOpen = computed(() => sidebarOpen.value)
  const isNotificationsOpen = computed(() => notificationsOpen.value)
  const isMobileMenuOpen = computed(() => mobileMenuOpen.value)
  const getTheme = computed(() => theme.value)
  const getLanguage = computed(() => language.value)
  const getNotifications = computed(() => notifications.value)
  const hasUnreadNotifications = computed(() => 
    notifications.value.some(n => !n.read)
  )
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  // Actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const openSidebar = () => {
    sidebarOpen.value = true
  }

  const closeSidebar = () => {
    sidebarOpen.value = false
  }

  const toggleNotifications = () => {
    notificationsOpen.value = !notificationsOpen.value
    if (notificationsOpen.value) {
      markAllAsRead()
    }
  }

  const openNotifications = () => {
    notificationsOpen.value = true
    markAllAsRead()
  }

  const closeNotifications = () => {
    notificationsOpen.value = false
  }

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  const openMobileMenu = () => {
    mobileMenuOpen.value = true
  }

  const closeMobileMenu = () => {
    mobileMenuOpen.value = false
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme()
    saveToLocalStorage()
  }

  const setTheme = (newTheme) => {
    if (['light', 'dark'].includes(newTheme)) {
      theme.value = newTheme
      applyTheme()
      saveToLocalStorage()
    }
  }

  const setLanguage = (lang) => {
    if (['uz', 'ru', 'en'].includes(lang)) {
      language.value = lang
      saveToLocalStorage()
    }
  }

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      title: notification.title,
      message: notification.message,
      type: notification.type || 'info',
      read: false,
      timestamp: new Date().toISOString(),
      action: notification.action,
      actionLabel: notification.actionLabel
    }
    
    notifications.value.unshift(newNotification)
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
    
    saveToLocalStorage()
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 30000)
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
    saveToLocalStorage()
  }

  const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
      saveToLocalStorage()
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => {
      n.read = true
    })
    saveToLocalStorage()
  }

  const clearAllNotifications = () => {
    notifications.value = []
    saveToLocalStorage()
  }

  const showToast = (options) => {
    const toast = {
      id: Date.now(),
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 3000
    }
    
    toastQueue.value.push(toast)
    setTimeout(() => {
      removeToast(toast.id)
    }, toast.duration)
    
    return toast.id
  }

  const removeToast = (id) => {
    toastQueue.value = toastQueue.value.filter(t => t.id !== id)
  }

  const clearAllToasts = () => {
    toastQueue.value = []
  }

  const setLoading = (isLoading) => {
    loading.value = isLoading
  }
  const applyTheme = () => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const saveToLocalStorage = () => {
    try {
      const data = {
        theme: theme.value,
        language: language.value,
        notifications: notifications.value,
        sidebarOpen: sidebarOpen.value
      }
      localStorage.setItem('ui_settings', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save UI settings:', error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const data = JSON.parse(localStorage.getItem('ui_settings'))
      if (data) {
        theme.value = data.theme || 'light'
        language.value = data.language || 'uz'
        notifications.value = data.notifications || []
        sidebarOpen.value = data.sidebarOpen || false
        
        applyTheme()
      }
    } catch (error) {
      console.error('Failed to load UI settings:', error)
    }
  }
  const showSuccessNotification = (message, title = 'Muvaffaqiyatli') => {
    addNotification({
      title,
      message,
      type: 'success'
    })
  }

  const showErrorNotification = (message, title = 'Xatolik') => {
    addNotification({
      title,
      message,
      type: 'error'
    })
  }

  const showWarningNotification = (message, title = 'Ogohlantirish') => {
    addNotification({
      title,
      message,
      type: 'warning'
    })
  }

  const showInfoNotification = (message, title = 'Ma\'lumot') => {
    addNotification({
      title,
      message,
      type: 'info'
    })
  }

  const showLowStockNotification = (productName, quantity) => {
    addNotification({
      title: 'Kam zaxira',
      message: `${productName} maxsulotining zaxirasi kamaydi (${quantity} ta qoldi)`,
      type: 'warning',
      action: '/products',
      actionLabel: 'Ko\'rish'
    })
  }

  const showOutOfStockNotification = (productName) => {
    addNotification({
      title: 'Zaxira tugadi',
      message: `${productName} maxsuloti tugadi`,
      type: 'error',
      action: '/products',
      actionLabel: 'Ko\'rish'
    })
  }
  const init = () => {
    loadFromLocalStorage()
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      if (!localStorage.getItem('ui_settings')) {
        theme.value = 'dark'
        applyTheme()
      }
    }
  }

  return {
    sidebarOpen,
    notificationsOpen,
    theme,
    language,
    notifications,
    toastQueue,
    loading,
    mobileMenuOpen,
    isSidebarOpen,
    isNotificationsOpen,
    isMobileMenuOpen,
    getTheme,
    getLanguage,
    getNotifications,
    hasUnreadNotifications,
    unreadCount,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    toggleNotifications,
    openNotifications,
    closeNotifications,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    toggleTheme,
    setTheme,
    setLanguage,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    showToast,
    removeToast,
    clearAllToasts,
    setLoading,
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    showLowStockNotification,
    showOutOfStockNotification,
    init
  }
})