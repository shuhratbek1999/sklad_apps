import api from './api'

export const productService = {
  async getAllProducts(params = {}) {
    try {
      const response = await api.get('/products', { params })
      return response
    } catch (error) {
      throw error
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`)
      return response
    } catch (error) {
      throw error
    }
  },

 async createProduct(formData) {
    try {
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response
    } catch (error) {
      throw error
    }
  },
  async update(id, formData) {
    return await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  async addStock(productId, stockData) {
    try {
      const response = await api.post(`/products/${productId}/add`, stockData)
      return response
    } catch (error) {
      throw error
    }
  },

  async sellProduct(productId, sellData) {
    try {
      const response = await api.post(`/products/${productId}/sell`, sellData)
      return response
    } catch (error) {
      throw error
    }
  },

  async updateProduct(productId, productData) {
    try {
      const formData = new FormData()
      
      Object.keys(productData).forEach(key => {
        if (key === 'image' && productData[key] instanceof File) {
          formData.append('image', productData[key])
        } else if (productData[key] !== undefined && productData[key] !== null) {
          formData.append(key, productData[key])
        }
      })
      
      const response = await api.put(`/products/${productId}`, formData)
      return response
    } catch (error) {
      throw error
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await api.delete(`/products/${productId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  async getStats() {
    try {
      const response = await api.get('/products/stats')
      return response
    } catch (error) {
      throw error
    }
  },

  async deleteImage(productId) {
    try {
      const response = await api.delete(`/products/${productId}/image`)
      return response
    } catch (error) {
      throw error
    }
  }
}