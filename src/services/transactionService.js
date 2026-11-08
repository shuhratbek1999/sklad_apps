
import api from './api'

const transactionService = {
  // Kirim-chiqim tarixi
  getAll(params = {}) {
    return api.get('/transactions', { params })
  },

  // Bitta transaction
  getById(id) {
    return api.get(`/transactions/${id}`)
  },

  // Bugungi savdolar
  getDailySales(params = {}) {
    return api.get('/transactions/daily-sales', { params })
  },

  // Daromad hisoboti
  getRevenueReport(params = {}) {
    return api.get('/transactions/revenue-report', { params })
  },

  // Kirim-chiqim statistikasi
  getStats(params = {}) {
    return api.get('/transactions/stats', { params })
  }
}

export default transactionService
