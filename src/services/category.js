import api from './api'

export const categoryService = {
  async getAll() {
    const response = await api.get('/category')
    console.log(response);
    
    return response
  },

  async getWithProducts(id) {
    return await api.get(`/category/${id}/products`)
  },

  async create(formData) {
    return await api.post('/category', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Kategoriyani tahrirlash
  async update(id, formData) {
    return await api.put(`/category/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Kategoriyani o'chirish
  async delete(id) {
    return await api.delete(`/category/${id}`)
  },
  async moveProducts(data) {
    return await api.post('/category/move-products', data)
  }
}