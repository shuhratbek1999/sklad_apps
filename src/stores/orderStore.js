
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { orderService } from '@/services/orderService'

export const useOrderStore = defineStore('orders', () => {
  // =========================
  // STATE
  // =========================

  const orders = ref([])
  const currentOrder = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // =========================
  // HELPERS
  // =========================

  const getErrorMessage = (err, fallback) => {
    return err?.message || fallback
  }

  const normalizeOrder = (response) => {
    // API service response.data qaytarishi
    // yoki bevosita order qaytarishi mumkin.
    return response?.data ?? response
  }

  const normalizeOrders = (response) => {
    const data = normalizeOrder(response)

    if (Array.isArray(data)) {
      return data
    }

    // Ayrim API'larda ro'yxat nested bo'ladi
    if (Array.isArray(data?.orders)) {
      return data.orders
    }

    return []
  }

  const isSameId = (first, second) => {
    return String(first) === String(second)
  }

  const isToday = (dateString) => {
    if (!dateString) return false

    const date = new Date(dateString)

    if (Number.isNaN(date.getTime())) {
      return false
    }

    const today = new Date()

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  const updateOrderInList = (updatedOrder) => {
    if (!updatedOrder?.id) return

    const index = orders.value.findIndex(order =>
      isSameId(order?.id, updatedOrder.id)
    )

    if (index !== -1) {
      orders.value[index] = {
        ...orders.value[index],
        ...updatedOrder
      }
    }
  }

  const removeOrderFromList = (id) => {
    orders.value = orders.value.filter(
      order => !isSameId(order?.id, id)
    )

    if (
      currentOrder.value &&
      isSameId(currentOrder.value.id, id)
    ) {
      currentOrder.value = null
    }
  }

  // =========================
  // GETTERS
  // =========================

  // Barcha buyurtmalar soni
  const totalOrders = computed(() => {
    return orders.value.length
  })

  // Faqat tasdiqlanmagan buyurtmalar
  const pendingOrders = computed(() => {
    return orders.value.filter(order =>
      order?.status === 'pending'
    )
  })

  // Tasdiqlangan buyurtmalar
  const confirmedOrders = computed(() => {
    return orders.value.filter(order =>
      order?.status === 'confirmed'
    )
  })

  // BUGUNGI TASDIQLANMAGAN BUYURTMALAR
  const todayOrders = computed(() => {
    return pendingOrders.value
      .filter(order => {
        const dateString =
          order.createdAt ||
          order.created_at ||
          order.order_date

        return isToday(dateString)
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.createdAt || a.created_at || a.order_date
        )

        const dateB = new Date(
          b.createdAt || b.created_at || b.order_date
        )

        return dateB.getTime() - dateA.getTime()
      })
  })

  // Bugungi tasdiqlanmagan buyurtmalar summasi
  const todayTotal = computed(() => {
    return todayOrders.value.reduce((sum, order) => {
      return sum + (Number(order?.total_amount) || 0)
    }, 0)
  })

  // Bugungi tasdiqlanmagan buyurtmalar soni
  const todayCount = computed(() => {
    return todayOrders.value.length
  })

  // Barcha tasdiqlanmagan buyurtmalar soni
  const pendingCount = computed(() => {
    return pendingOrders.value.length
  })

  // Barcha tasdiqlangan buyurtmalar soni
  const confirmedCount = computed(() => {
    return confirmedOrders.value.length
  })

  // =========================
  // FETCH ALL ORDERS
  // =========================

  const fetchOrders = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.getAllOrders()

      orders.value = normalizeOrders(response)

      console.log(
        'Buyurtmalar yuklandi:',
        orders.value.length
      )

      return orders.value

    } catch (err) {
      error.value = getErrorMessage(
        err,
        "Buyurtmalarni yuklab bo'lmadi"
      )

      console.error('fetchOrders error:', err)

      throw err

    } finally {
      loading.value = false
    }
  }

  // =========================
  // FETCH ORDER BY ID
  // =========================

  const fetchOrderById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.getOrderById(id)

      const order = normalizeOrder(response)

      currentOrder.value = order || null

      return currentOrder.value

    } catch (err) {
      error.value = getErrorMessage(
        err,
        "Buyurtmani yuklab bo'lmadi"
      )

      console.error('fetchOrderById error:', err)

      throw err

    } finally {
      loading.value = false
    }
  }

  // =========================
  // CREATE ORDER
  // =========================

  const createOrder = async (orderData) => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.createOrder(
        orderData
      )

      const newOrder = normalizeOrder(response)

      if (!newOrder?.id) {
        throw new Error(
          "Server buyurtma ma'lumotlarini to'liq qaytarmadi"
        )
      }

      // Yangi buyurtma pending bo'ladi
      const createdOrder = {
        ...newOrder,
        status: newOrder.status || 'pending'
      }

      orders.value = [
        createdOrder,
        ...orders.value.filter(
          order => !isSameId(order?.id, createdOrder.id)
        )
      ]

      currentOrder.value = createdOrder

      console.log(
        'Buyurtma yaratildi:',
        createdOrder.id
      )

      return createdOrder

    } catch (err) {
      error.value = getErrorMessage(
        err,
        'Buyurtma yaratishda xatolik'
      )

      console.error('createOrder error:', err)

      throw err

    } finally {
      loading.value = false
    }
  }

  // =========================
  // CONFIRM ORDER
  // =========================

  const confirmOrder = async (id, data) => {
    loading.value = true
    error.value = null

    try {
      const response = await orderService.confirmOrder(
        id,
        data
      )

      const result = normalizeOrder(response)

      // Serverdan to'liq order qaytsa ishlatamiz.
      // Qaytmasa, mavjud order asosida yangilaymiz.
      const existingOrder =
        orders.value.find(order =>
          isSameId(order?.id, id)
        ) ||
        (
          isSameId(currentOrder.value?.id, id)
            ? currentOrder.value
            : null
        )

      const confirmedOrder = {
        ...(existingOrder || {}),
        ...(result && typeof result === 'object'
          ? result
          : {}),
        id: result?.id || existingOrder?.id || id,
        status: 'confirmed'
      }

      // Store ichida status yangilanadi.
      // Shu sabab todayOrders avtomatik o'zgaradi.
      updateOrderInList(confirmedOrder)

      currentOrder.value = confirmedOrder

      console.log(
        'Buyurtma tasdiqlandi:',
        confirmedOrder.id
      )

      return confirmedOrder

    } catch (err) {
      error.value = getErrorMessage(
        err,
        'Buyurtmani tasdiqlashda xatolik'
      )

      console.error('confirmOrder error:', err)

      throw err

    } finally {
      loading.value = false
    }
  }

  // =========================
  // DELETE ORDER
  // =========================

  const deleteOrder = async (id) => {
    loading.value = true
    error.value = null

    try {
      await orderService.deleteOrder(id)

      removeOrderFromList(id)

      console.log('Buyurtma ochirildi:', id)

      return true

    } catch (err) {
      error.value = getErrorMessage(
        err,
        "Buyurtmani o'chirishda xatolik"
      )

      console.error('deleteOrder error:', err)

      throw err

    } finally {
      loading.value = false
    }
  }

  // =========================
  // AUTO DELETE ORDER
  // =========================

  const autoDeleteOrder = async (id) => {
    loading.value = true
    error.value = null

    try {
      await orderService.autoDeleteOrder(id)

      removeOrderFromList(id)

      console.log(
        'Buyurtma avtomatik ochirildi:',
        id
      )

      return true

    } catch (err) {
      error.value = getErrorMessage(
        err,
        "Buyurtmani avtomatik o'chirishda xatolik"
      )

      console.error('autoDeleteOrder error:', err)

      throw err

    } finally {
      loading.value = false
    }
  }

  // =========================
  // CLEAR CURRENT ORDER
  // =========================

  const clearCurrentOrder = () => {
    currentOrder.value = null
  }

  const clearError = () => {
    error.value = null
  }

  // =========================
  // RETURN
  // =========================

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,

    // Getters
    totalOrders,
    pendingOrders,
    confirmedOrders,
    todayOrders,
    todayTotal,
    todayCount,
    pendingCount,
    confirmedCount,

    // Actions
    fetchOrders,
    fetchOrderById,
    createOrder,
    confirmOrder,
    deleteOrder,
    autoDeleteOrder,
    clearCurrentOrder,
    clearError
  }
})
