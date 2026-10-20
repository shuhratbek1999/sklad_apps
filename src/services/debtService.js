import api from './api';


export const debtService = {
  // Barcha mijozlarni olish
  async getAllCustomers() {
    const response = await api.get(`/customers`);
    console.log(response);
    
    return response;
  },

  // Yangi mijoz qo'shish
  async createCustomer(customerData) {
    const response = await api.post(`/customers`, customerData);
    return response.data;
  },
  
  // Balansni yangilash (+ yoki -)
  async updateBalance(id, payload) {
    const response = await api.post(`/customers/${id}/update-balance`, payload);
    return response.data;
  },

  // Mijozni o'chirish
  async deleteCustomer(id) {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
  async getCustomerTransactions(customerId) {
  try {
    const response = await api.get(`/customers/history/${customerId}`);
    return response; // Odatda [ {id: 1, amount: 5000, ...}, ... ] qaytadi
  } catch (error) {
    console.error('Tranzaksiyalarni olishda xatolik:', error);
    throw error;
  }
},
};