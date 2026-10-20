import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import toastPlugin from './plugins/toast'
import { registerSW } from 'virtual:pwa-register'
// Import CSS - Bu eng muhim qism!
import '@/assets/styles/main.css'  
registerSW({ immediate: true })
// App yaratish
const app = createApp(App)

// Pinia store
const pinia = createPinia()
app.use(pinia) 

// Router
app.use(router)

// Toast plugin
app.use(toastPlugin)

// Mount
app.mount('#app')