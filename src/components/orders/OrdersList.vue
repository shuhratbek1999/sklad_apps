<template>
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b">
            <h3 class="text-lg font-semibold">Buyurtmalar ro'yxati</h3>
        </div>

        <div v-if="loading" class="text-center py-8">
            <Spinner size="md" />
        </div>

        <div v-else-if="!orders.length" class="text-center py-8">
            <p class="text-gray-500">Hozircha buyurtmalar mavjud emas</p>
        </div>

        <div v-else class="divide-y">
            <div v-for="order in orders" :key="order.id" class="p-4 hover:bg-gray-50">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm text-gray-500">
                            {{ formatDate(order.order_date) }}
                        </p>
                        <div class="mt-2 space-y-1">
                            <div v-for="item in order.items" :key="item.id" class="text-sm">
                                {{ item.product.name }} -
                                {{ item.quantity }} ta ×
                                {{ formatCurrency(item.price) }} =
                                {{ formatCurrency(item.quantity * item.price) }}
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold text-primary-600">
                            {{ formatCurrency(order.total_amount) }}
                        </p>
                        <button @click="deleteOrder(order.id)" class="text-red-600 hover:text-red-800 text-sm mt-2">
                            🗑️ O'chirish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Spinner from '@/components/ui/Spinner.vue';

const orderStore = useOrderStore();
const { orders, loading } = orderStore;

onMounted(() => {
    orderStore.fetchOrders();
});

const deleteOrder = async (id) => {
    if (confirm('Bu buyurtmani o\'chirishni tasdiqlaysizmi?')) {
        await orderStore.deleteOrder(id);
    }
};
</script>