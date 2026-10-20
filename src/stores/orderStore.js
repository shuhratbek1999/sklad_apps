// src/stores/orderStore.js - TO'G'RILANGAN ✅
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { orderService } from '@/services/orderService';

export const useOrderStore = defineStore('orders', () => {
  // State
  const orders = ref([]);
  const currentOrder = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const totalOrders = computed(() => orders.value.length);
  // orderStore.js ga qo'shing
const confirmOrder = async (id, data) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await orderService.confirmOrder(id, data);
    // Update current order
    currentOrder.value = response.data;
    // Update orders list
    const index = orders.value.findIndex(o => o.id === id);
    if (index !== -1) {
      orders.value[index] = response.data;
    }
    return response.data;
  } catch (err) {
    error.value = err.message;
    throw err;
  } finally {
    loading.value = false;
  }
};

const autoDeleteOrder = async (id) => {
  loading.value = true;
  error.value = null;
  try {
    await orderService.autoDeleteOrder(id);
    // Remove from orders list
    orders.value = orders.value.filter(o => o.id !== id);
    // Clear current order if it's the one deleted
    if (currentOrder.value?.id === id) {
      currentOrder.value = null;
    }
    return true;
  } catch (err) {
    error.value = err.message;
    throw err;
  } finally {
    loading.value = false;
  }
};
  // ✅ BUGUNGI BUYURTMALAR - XATOLIK TO'G'RILANDI
  const todayOrders = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return orders.value.filter(order => {
      // MUHIM: order undefined bo'lmasligi kerak
      if (!order) return false;
      
      // MUHIM: createdAt mavjudligini tekshir
      const dateStr = order.createdAt || order.order_date || order.created_at;
      if (!dateStr) return false;
      
      const orderDate = new Date(dateStr);
      orderDate.setHours(0, 0, 0, 0);
      
      return orderDate.getTime() === today.getTime();
    });
  });

  // ✅ BUGUNGI JAMI SUMMA
  const todayTotal = computed(() => {
    return todayOrders.value.reduce((sum, order) => {
      return sum + (parseFloat(order?.total_amount) || 0);
    }, 0);
  });

  // ✅ BUGUNGI BUYURTMALAR SONI
  const todayCount = computed(() => todayOrders.value.length);

  // Actions
  const fetchOrders = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await orderService.getAllOrders();
      // MUHIM: response.data array ekanligini tekshir
      orders.value = Array.isArray(response) ? response : [];
      console.log('📦 Orders loaded:', orders.value.length);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchOrderById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await orderService.getOrderById(id);
      currentOrder.value = response || null;
      return response;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ✅ CREATE ORDER - XATOLIK TO'G'RILANDI
  const createOrder = async (orderData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await orderService.createOrder(orderData);
      
      // MUHIM: response.data ni tekshirish
      if (!response) {
        throw new Error('Serverdan ma\'lumot kelmadi');
      }
      
      // MUHIM: order obyektini tekshirish
      const newOrder = response;
      if (!newOrder.id) {
        console.warn('⚠️ Order created but no id returned:', newOrder);
        // Agar id bo'lmasa, vaqtinchalik id yarat
        newOrder.id = Date.now();
      }
      
      // orders array ga qo'shish
      orders.value = [newOrder, ...orders.value];
      
      console.log('✅ Order created:', newOrder.id);
      return newOrder;
      
    } catch (err) {
      console.error('❌ Error creating order:', err);
      error.value = err.message || 'Buyurtma yaratishda xatolik';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteOrder = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await orderService.deleteOrder(id);
      orders.value = orders.value.filter(o => o?.id !== id);
      console.log('🗑️ Order deleted:', id);
      return true;
    } catch (err) {
      console.error('❌ Error deleting order:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearCurrentOrder = () => {
    currentOrder.value = null;
  };

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    
    // Getters
    totalOrders,
    todayOrders,
    todayTotal,
    todayCount,
    
    // Actions
    fetchOrders,
    fetchOrderById,
    createOrder,
    deleteOrder,
    clearCurrentOrder,
    confirmOrder,
    autoDeleteOrder
  };
});