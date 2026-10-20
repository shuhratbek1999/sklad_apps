import { ref, onUnmounted } from 'vue'
import axios from 'axios'

export function useApi(endpoint, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const controller = ref(null)

  const fetchData = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // Oldingi request ni bekor qilish
      if (controller.value) {
        controller.value.abort()
      }
      
      controller.value = new AbortController()
      
      const config = {
        ...options,
        params,
        signal: controller.value.signal
      }
      
      const response = await axios.get(endpoint, config)
      data.value = response.data
      return response.data
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err.message
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const postData = async (payload) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(endpoint, payload, options)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const putData = async (payload) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.put(endpoint, payload, options)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.delete(endpoint, options)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  onUnmounted(() => {
    if (controller.value) {
      controller.value.abort()
    }
  })

  return {
    data,
    error,
    loading,
    fetchData,
    postData,
    putData,
    deleteData,
    refresh: fetchData
  }
}