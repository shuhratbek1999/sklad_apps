import { defineStore } from 'pinia';
import { debtService } from '@/services/debtService';

export const useDebtStore = defineStore('debt', {
  state: () => ({
    customers: [],
    selectedTransactions: [],
    loading: false,
    error: null
  }),

  getters: {
    totalDebts: (state) => {
      if (!Array.isArray(state.customers)) return 0;
      
      return state.customers
        .filter(c => c && c.balance !== undefined && parseFloat(c.balance) > 0)
        .reduce((sum, c) => sum + parseFloat(c.balance || 0), 0);
    },
    totalCredits: (state) => {
      if (!Array.isArray(state.customers)) return 0;

      return state.customers
        .filter(c => c && c.balance !== undefined && parseFloat(c.balance) < 0)
        .reduce((sum, c) => sum + Math.abs(parseFloat(c.balance || 0)), 0);
    }
  },

  actions: {
    async fetchCustomers() {
      this.loading = true;
      this.error = null;
      try {
        const res = await debtService.getAllCustomers();
        this.customers = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        this.error = err.message || "Ma'lumot yuklashda xatolik";
        this.customers = []; 
      } finally {
        this.loading = false;
      }
    },

    async addCustomer(data) {
      try {
        const res = await debtService.createCustomer(data);
        if (res && res.success && res.data) {
          if (!Array.isArray(this.customers)) this.customers = [];
          this.customers.push(res.data);
        }
        return res;
      } catch (err) {
        console.error("Mijoz qo'shishda xatolik:", err);
        throw err;
      }
    },

    async modifyBalance(id, payload) {
      try {
        const res = await debtService.updateBalance(id, payload);
        if (res && res.success) {
          const index = this.customers.findIndex(c => c.id === id);
          if (index !== -1) {
            // Balansni yangilash
            this.customers[index].balance = res.newBalance;
            this.customers[index].updatedAt = new Date();
          }
        }
        return res;
      } catch (err) {
        console.error("Balansni o'zgartirishda xatolik:", err);
        throw err;
      }
    },

    async removeCustomer(id) {
      try {
        const res = await debtService.deleteCustomer(id);
        if (res && res.success) {
          this.customers = this.customers.filter(c => c.id !== id);
        }
        return res;
      } catch (err) {
        console.error("Mijozni o'chirishda xatolik:", err);
        throw err;
      }
    },
    async fetchCustomerTransactions(customerId) {
      this.loading = true;
      this.selectedTransactions = []; // Eskisini tozalab turamiz
      try {
        const data = await debtService.getCustomerTransactions(customerId);
        this.selectedTransactions = Array.isArray(data) ? data : [];
        return this.selectedTransactions;
      } catch (err) {
        this.error = err.message;
        return [];
      } finally {
        this.loading = false;
      }
    }
  }
});