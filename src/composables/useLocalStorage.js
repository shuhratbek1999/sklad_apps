import { ref, watch } from 'vue'

export function useLocalStorage(key, initialValue) {
  // LocalStorage dan o'qish
  const storedValue = localStorage.getItem(key)
  const data = ref(storedValue ? JSON.parse(storedValue) : initialValue)

  // LocalStorage ga yozish
  const setValue = (value) => {
    data.value = value
    localStorage.setItem(key, JSON.stringify(value))
  }

  // Watch for changes
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  // O'chirish
  const removeValue = () => {
    data.value = initialValue
    localStorage.removeItem(key)
  }

  // Tozalash
  const clearAll = () => {
    localStorage.clear()
    data.value = initialValue
  }

  return {
    data,
    setValue,
    removeValue,
    clearAll
  }
}

// Maxsulotlar uchun localStorage
export function useProductStorage() {
  const { data: products, setValue: setProducts } = useLocalStorage('products', [])
  
  const addProduct = (product) => {
    const newProducts = [...products.value, product]
    setProducts(newProducts)
  }
  
  const updateProduct = (id, updates) => {
    const newProducts = products.value.map(product => 
      product.id === id ? { ...product, ...updates } : product
    )
    setProducts(newProducts)
  }
  
  const deleteProduct = (id) => {
    const newProducts = products.value.filter(product => product.id !== id)
    setProducts(newProducts)
  }
  
  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    setProducts
  }
}