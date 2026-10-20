import { defineStore } from 'pinia'
import { categoryService } from '../services/category'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    currentCategory: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const response = await categoryService.getAll()
        // API dan data.data kelsa response.data.data bo'lishi mumkin, tekshirib ko'ring
        this.categories = response.data.data || response.data
      } catch (err) {
        this.error = err.response?.data?.error || 'Kategoriyalarni yuklashda xatolik'
      } finally {
        this.loading = false
      }
    },

    async fetchCategoryProducts(id) {
      this.loading = true
      this.currentCategory = null
      try {
        const response = await categoryService.getWithProducts(id)
        this.currentCategory = response.data.data || response.data
        return this.currentCategory
      } catch (err) {
        this.error = err.response?.data?.error || 'Mahsulotlarni yuklashda xatolik'
        throw err
      } finally {
        this.loading = false
      }
    },

    async addCategory(formData) {
      this.loading = true
      try {
        const response = await categoryService.create(formData)
        const newCat = response.data.data || response.data
        this.categories.push(newCat)
        return true
      } catch (err) {
        this.error = err.response?.data?.error || 'Kategoriya qo\'shishda xatolik'
        return false
      } finally {
        this.loading = false
      }
    },

    async removeCategory(id) {
      try {
        await categoryService.delete(id)
        this.categories = this.categories.filter(c => c.id !== id)
        return true
      } catch (err) {
        this.error = err.response?.data?.error || 'O\'chirishda xatolik yuz berdi'
        return false
      }
    },

    async updateCategory(id, formData) {
      this.loading = true
      try {
        const response = await categoryService.update(id, formData)
        const updatedCat = response.data.data || response.data
        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) this.categories[index] = updatedCat
        return true
      } catch (err) {
        this.error = err.response?.data?.error || err.message
        return false
      } finally {
        this.loading = false
      }
    },

async moveProductsToCategory(product_ids, new_category_id) {
    this.loading = true 
    this.error = null
    try {
        const payload = { 
            product_ids, 
            new_category_id 
        }
        
        const response = await categoryService.moveProducts(payload)
        // console.log(response,payload,"aloooo");
        
        if (response.success) {
            // currentCategory-ni tekshirishda ham 'this' ishlatiladi
            if (this.currentCategory) {
                await this.fetchCategoryProducts(this.currentCategory.id)
            }
            await this.fetchCategories()
            
            return { success: true, message: response.message }
        }
    } catch (err) {
        this.error = err.response?.data?.error || 'Mahsulotlarni ko\'chirishda xatolik'
        return { success: false, error: this.error }
    } finally {
        this.loading = false // Bu yerda ham 'this'
    }
}
  }
})