import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductWithStatsStore } from '../stores/productWithStatsStore'

export function useProductWithStats() {
  const store = useProductWithStatsStore()
  const { 
    products, 
    loading, 
    error, 
    totalProducts, 
    totalValue, 
    lowStockProducts, 
    outOfStockProducts, 
    lowStockCount, 
    outOfStockCount 
  } = storeToRefs(store)

  const searchQuery = ref('')
  const sortBy = ref('created_at')
  const sortOrder = ref('desc')
  const filterByStock = ref('all')

  const filteredProducts = computed(() => {
    let prods = [...products.value]
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      prods = prods.filter(product =>
        product.name.toLowerCase().includes(query)
      )
    }

    if (filterByStock.value !== 'all') {
      prods = prods.filter(product => {
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
    prods.sort((a, b) => {
      let valueA = a[sortBy.value]
      let valueB = b[sortBy.value]
      if (sortBy.value === 'created_at') {
        valueA = new Date(valueA)
        valueB = new Date(valueB)
      }
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder.value === 'asc' ? valueA - valueB : valueB - valueA
      }
      if (sortOrder.value === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    return prods
  })

  return {
    products,
    loading,
    error,
    totalProducts,
    totalValue,
    lowStockProducts,
    outOfStockProducts,
    lowStockCount,
    outOfStockCount,
    filteredProducts,
    searchQuery,
    sortBy,
    sortOrder,
    filterByStock,
    fetchProducts: store.fetchProductsWithStats,
    getProductById: store.getProductById
  }
}