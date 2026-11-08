
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import transactionService from '@/services/transactionService'

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref([])
  const recentTransactions = ref([])
  const stats = ref(null)
  const pagination = ref(null)

  const loading = ref(false)
  const recentLoading = ref(false)
  const statsLoading = ref(false)

  const error = ref(null)

  const incomingTransactions = computed(() =>
    transactions.value.filter(item => item.type === 'add')
  )

  const outgoingTransactions = computed(() =>
    transactions.value.filter(item => item.type === 'sell')
  )

  const incomingStats = computed(() => stats.value?.incoming ?? {
    total_transactions: 0,
    total_quantity: 0,
    total_amount: 0
  })

  const outgoingStats = computed(() => stats.value?.outgoing ?? {
    total_transactions: 0,
    total_quantity: 0,
    total_amount: 0
  })

  // Barcha tarix: pagination va filtrlar bilan
  const fetchTransactions = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await transactionService.getAll(params)

      transactions.value = Array.isArray(response?.data)
        ? response.data
        : []

      pagination.value = response?.pagination ?? null

      return transactions.value
    } catch (err) {
      error.value = err.message || 'Tarixni yuklashda xatolik'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Home uchun oxirgi 5 ta harakat
  const fetchRecentTransactions = async () => {
    recentLoading.value = true

    try {
      const response = await transactionService.getAll({
        page: 1,
        limit: 5
      })

      recentTransactions.value = Array.isArray(response?.data)
        ? response.data
        : []

      return recentTransactions.value
    } finally {
      recentLoading.value = false
    }
  }

  // Kirim-chiqim statistikasi
  const fetchStats = async (params = {}) => {
    statsLoading.value = true

    try {
      const response = await transactionService.getStats(params)
      stats.value = response?.data ?? null
      return stats.value
    } finally {
      statsLoading.value = false
    }
  }

  const clearTransactions = () => {
    transactions.value = []
    recentTransactions.value = []
    stats.value = null
    pagination.value = null
    error.value = null
  }

  return {
    transactions,
    recentTransactions,
    stats,
    pagination,
    loading,
    recentLoading,
    statsLoading,
    error,
    incomingTransactions,
    outgoingTransactions,
    incomingStats,
    outgoingStats,
    fetchTransactions,
    fetchRecentTransactions,
    fetchStats,
    clearTransactions
  }
})
