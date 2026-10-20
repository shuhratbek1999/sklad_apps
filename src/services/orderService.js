
import api from './api';

export const orderService = {
  // Get all orders
  async getAllOrders() {
    try {
      const response = await api.get('/orders');
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Create order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      // console.log(response.data,"createe");
      
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Delete order
  async deleteOrder(id) {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },
  // orderService.js ga qo'shing
async confirmOrder(id, data) {
  try {
    const response = await api.post(`/orders/${id}/confirm`, data);
    return response.data;
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error;
  }
},

async autoDeleteOrder(id) {
  try {
    const response = await api.delete(`/orders/${id}/auto-delete`);
    return response.data;
  } catch (error) {
    console.error('Error auto-deleting order:', error);
    throw error;
  }
}
};