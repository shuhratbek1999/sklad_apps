import axios from 'axios'
// useRouter o'rniga routerni o'zini import qiling
import router from '@/router' 

const API_BASE_URL = "https://sklad.net.uz/api"
// const API_BASE_URL = "https://api2.qurilishcrm.com.uz/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // LocalStorage dagi kalit nomini yana bir bor tekshiring: 'tokenSklad'
    const token = localStorage.getItem('tokenSklad')
    
    if (token) {
      // Ba'zida Bearer so'zidan keyin bo'sh joy qolib ketishi yoki 
      // token noto'g'ri saqlangan bo'lishi mumkin.
      config.headers.Authorization = `Bearer ${token}`
    }
    
    if (config.data instanceof FormData) {
      // FormData bo'lsa Content-Type ni o'chirish ma'qul, 
      // Axios o'zi boundary bilan avtomatik qo'shadi
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { response } = error
    
    if (!response) {
      return Promise.reject(error)
    }
    
    // 401 - Unauthorized bo'lsa login sahifasiga otish
    if (response.status === 401) {
      localStorage.removeItem('tokenSklad')
      router.push('/login')
    }
    
    const errorData = {
      status: response.status,
      message: response.data?.error || response.data?.message || 'Serverda xatolik yuz berdi',
      errors: response.data?.errors
    }
    
    return Promise.reject(errorData)
  }
)

export default api