import api from './api';

export const productWithStatsService = {
  async getProductsWithStats() {
    try {
      const response = await api.get('/products/products-with-stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};