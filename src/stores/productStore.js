import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService } from '@/services/productService'

export const useProductStore = defineStore('products', () => {
  const products = ref([]) 
  const currentProduct = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const stats = ref(null)
  const totalProducts = computed(() => products.value.length)
  
  const totalValue = computed(() => {
    return products.value.reduce((total, product) => {
      return total + (product.price * product.quantity)
    }, 0)
  })

  const lowStockProducts = computed(() => {
    return products.value.filter(product => product.quantity < 200)
  })

  const outOfStockProducts = computed(() => {
    return products.value.filter(product => product.quantity === 0)
  })

  // Actions
  const fetchProducts = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.getAllProducts(params)
      products.value = response.data || []
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.getProductById(id)
      currentProduct.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (productData) => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.createProduct(productData)
      products.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const updateProduct = async (id, formData) => {
    loading.value = true
    try {
      const response = await productService.update(id, formData)
      const updatedData = response.data.data || response.data
      currentProduct.value = updatedData
      return { success: true, data: updatedData }
    } catch (err) {
      error.value = err.response?.data?.error || 'Yangilashda xatolik'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addStock = async (productId, stockData) => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.addStock(productId, stockData)
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = response.data.product
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const sellProduct = async (productId, sellData) => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.sellProduct(productId, sellData)
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = response.data.product
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (productId) => {
    loading.value = true
    error.value = null
    try {
      await productService.deleteProduct(productId)
      products.value = products.value.filter(p => p.id !== productId)
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.getStats()
      stats.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCurrentProduct = () => {
    currentProduct.value = null
  }

  return {
    products,
    currentProduct,
    loading,
    error,
    stats,
    totalProducts,
    totalValue,
    lowStockProducts,
    outOfStockProducts,
    fetchProducts,
    fetchProductById,
    createProduct,
    addStock,
    sellProduct,
    deleteProduct,
    fetchStats,
    clearCurrentProduct,
    updateProduct
  }
})