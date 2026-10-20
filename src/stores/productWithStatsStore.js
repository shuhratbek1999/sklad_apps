import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productWithStatsService } from '@/services/productWithStatsService'

export const useProductWithStatsStore = defineStore('productWithStats', () => {
  const products = ref([])
  const stats = ref({
    totalProducts: 0,
    totalValue: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    lowStockProductsList: [],
    outOfStockProductsList: []
  })
  const loading = ref(false)
  const error = ref(null)
  const totalProducts = computed(() => stats.value.totalProducts)
  const totalValue = computed(() => stats.value.totalValue)
  const lowStockProducts = computed(() => stats.value.lowStockProductsList)
  const outOfStockProducts = computed(() => stats.value.outOfStockProductsList)
  const lowStockCount = computed(() => stats.value.lowStockProducts)
  const outOfStockCount = computed(() => stats.value.outOfStockProducts)

  const fetchProductsWithStats = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await productWithStatsService.getProductsWithStats()
      products.value = response.products || []
      stats.value = response.stats || {}
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const getProductById = (id) => {
    return products.value.find(product => product.id === parseInt(id))
  }

  return {
    products,
    stats,
    loading,
    error,
    totalProducts,
    totalValue,
    lowStockProducts,
    outOfStockProducts,
    lowStockCount,
    outOfStockCount,
    fetchProductsWithStats,
    getProductById
  }
})