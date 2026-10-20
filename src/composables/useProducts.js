import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useToast } from '@/plugins/toast'

export function useProducts() {
  const productStore = useProductStore()
  const toast = useToast()
 console.log('useProducts called, store state:', {
    currentProduct: productStore.currentProduct,
    hasCurrentProduct: !!productStore.currentProduct,
    currentProductValue: productStore.currentProduct?.value
  })
  // Search va filter
  const searchQuery = ref('')
  const sortBy = ref('created_at')
  const sortOrder = ref('desc')
  const filterByStock = ref('all') // all, inStock, lowStock, outOfStock

  // Filtered products
  const filteredProducts = computed(() => {
    let products = [...productStore.products]

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      products = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.id.toString().includes(query)
      )
    }

    // Stock filter
    if (filterByStock.value !== 'all') {
      products = products.filter(product => {
        switch (filterByStock.value) {
          case 'inStock':
            return product.quantity >= 200
          case 'lowStock':
            return product.quantity > 0 && product.quantity < 200
          case 'outOfStock':
            return product.quantity === 0
          default:
            return true
        }
      })
    }

    // Sort
    products.sort((a, b) => {
      let valueA = a[sortBy.value]
      let valueB = b[sortBy.value]

      if (sortBy.value === 'created_at') {
        valueA = new Date(valueA)
        valueB = new Date(valueB)
      }

      if (sortOrder.value === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    return products
  })

  // Actions
  const handleAddStock = async (productId, stockData) => {
    try {
      await productStore.addStock(productId, stockData)
      toast.success('Zaxira muvaffaqiyatli qo\'shildi')
      return true
    } catch (error) {
      toast.error(error.message || 'Xatolik yuz berdi')
      return false
    }
  }

  const handleSellProduct = async (productId, sellData) => {
    try {
      await productStore.sellProduct(productId, sellData)
      toast.success('Maxsulot muvaffaqiyatli sotildi')
      return true
    } catch (error) {
      toast.error(error.message || 'Xatolik yuz berdi')
      return false
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await productStore.deleteProduct(productId)
      toast.success('Maxsulot muvaffaqiyatli o\'chirildi')
      return true
    } catch (error) {
      toast.error(error.message || 'Xatolik yuz berdi')
      return false
    }
  }

  return {
    // State
    products: productStore.products,
    currentProduct: productStore.currentProduct,
    loading: productStore.loading,
    error: productStore.error,
    stats: productStore.stats,
    
    // Computed
    totalProducts: productStore.totalProducts,
    totalValue: productStore.totalValue,
    lowStockProducts: productStore.lowStockProducts,
    outOfStockProducts: productStore.outOfStockProducts,
    filteredProducts,
    
    // Search & Filter
    searchQuery,
    sortBy,
    sortOrder,
    filterByStock,
    
    // Actions
    fetchProducts: productStore.fetchProducts,
    fetchProductById: productStore.fetchProductById,
    createProduct: productStore.createProduct,
    addStock: handleAddStock,
    sellProduct: handleSellProduct,
    deleteProduct: handleDeleteProduct,
    fetchStats: productStore.fetchStats,
    clearCurrentProduct: productStore.clearCurrentProduct
  }
}