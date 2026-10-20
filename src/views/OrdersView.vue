<template>
    <div class="animate-fade-in p-4 lg:p-6 space-y-6">
        <div class="mb-6">
            <Button @click="$router.back()" variant="outline" class="group hover:bg-gray-100">
                <span class="mr-2 group-hover:-translate-x-1 transition-transform inline-block">←</span>
                Ortga
            </Button>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span class="text-3xl">📋</span>
                    Buyurtmalar
                </h1>
                <p class="text-gray-500 mt-1">Barcha buyurtmalar ro'yxati</p>
            </div>

            <!-- Yangi buyurtma tugmasi -->
            <Button @click="openOrderModal" variant="success" icon="🛒">
                Yangi buyurtma
            </Button>
        </div>

        <!-- Filter Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div @click="filterStatus = 'all'" :class="[
                'bg-white p-4 rounded-xl border-2 cursor-pointer transition-all',
                filterStatus === 'all'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 hover:border-gray-300'
            ]">
                <p class="text-sm text-gray-500">Barchasi</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalOrders }}</p>
            </div>

            <div @click="filterStatus = 'today'" :class="[
                'bg-white p-4 rounded-xl border-2 cursor-pointer transition-all',
                filterStatus === 'today'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-100 hover:border-gray-300'
            ]">
                <p class="text-sm text-gray-500">Bugun</p>
                <p class="text-2xl font-bold text-green-600">{{ todayCount }}</p>
            </div>

            <div @click="filterStatus = 'week'" :class="[
                'bg-white p-4 rounded-xl border-2 cursor-pointer transition-all',
                filterStatus === 'week'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-100 hover:border-gray-300'
            ]">
                <p class="text-sm text-gray-500">Bu hafta</p>
                <p class="text-2xl font-bold text-blue-600">{{ weekCount }}</p>
            </div>

            <div @click="filterStatus = 'month'" :class="[
                'bg-white p-4 rounded-xl border-2 cursor-pointer transition-all',
                filterStatus === 'month'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-100 hover:border-gray-300'
            ]">
                <p class="text-sm text-gray-500">Bu oy</p>
                <p class="text-2xl font-bold text-purple-600">{{ monthCount }}</p>
            </div>
        </div>

        <!-- Search and Sort -->
        <Card class="p-4">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input v-model="searchQuery" type="text" placeholder="Buyurtma ID yoki mahsulot nomi..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <select v-model="sortBy"
                    class="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="newest">Eng yangi</option>
                    <option value="oldest">Eng eski</option>
                    <option value="amount_desc">Summa (katta > kichik)</option>
                    <option value="amount_asc">Summa (kichik > katta)</option>
                </select>
            </div>
        </Card>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" />
            <p class="mt-4 text-gray-500">Buyurtmalar yuklanmoqda...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12 bg-red-50 rounded-xl border border-red-100">
            <span class="text-5xl mb-4 block">❌</span>
            <p class="text-red-600 mb-4 font-medium">{{ error }}</p>
            <Button @click="fetchOrders" variant="primary">Qayta urinish</Button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredOrders.length"
            class="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <span class="text-6xl mb-4 block text-gray-400">📭</span>
            <h3 class="text-lg font-medium text-gray-900">Buyurtmalar topilmadi</h3>
            <p class="text-gray-500 mt-1 mb-6">
                {{ searchQuery ? 'Qidiruv so\'zini o\'zgartiring' : 'Hali hech qanday buyurtma qo\'shilmagan' }}
            </p>
            <Button v-if="!searchQuery" @click="openOrderModal" variant="success" icon="🛒">
                Birinchi buyurtma
            </Button>
            <Button v-else @click="clearSearch" variant="outline">
                Tozalash
            </Button>
        </div>

        <!-- Orders List -->
        <div v-else class="space-y-3">
            <div v-for="order in filteredOrders" :key="order.id" @click="viewOrder(order)"
                class="bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer">
                <div class="p-5">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <!-- Left: Order Info -->
                        <div class="flex items-start gap-4">
                            <div
                                class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                <span class="text-gray-600 text-xl">📋</span>
                            </div>

                            <div>
                                <div class="flex items-center gap-2 mb-1">
                                    <h3 class="font-semibold text-gray-900">
                                        Buyurtma #{{ order.id }}
                                    </h3>
                                    <span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                        {{ order.items?.length || 0 }} ta
                                    </span>
                                </div>

                                <div class="flex flex-wrap items-center gap-3 text-sm">
                                    <span class="text-gray-500 flex items-center gap-1">
                                        📅 {{ formatDate(order.order_date || order.createdAt) }}
                                    </span>
                                    <span class="text-gray-500 flex items-center gap-1">
                                        ⏰ {{ formatTime(order.createdAt) }}
                                    </span>
                                </div>

                                <!-- Products Preview -->
                                <div class="flex items-center gap-2 mt-2">
                                    <div class="flex -space-x-2">
                                        <div v-for="(item, idx) in order.items?.slice(0, 3)" :key="idx"
                                            class="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs"
                                            :title="item.product?.name">
                                            📦
                                        </div>
                                        <div v-if="order.items?.length > 3"
                                            class="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                            +{{ order.items.length - 3 }}
                                        </div>
                                    </div>
                                    <span class="text-xs text-gray-500">
                                        {{ order.items?.[0]?.product?.name || 'Mahsulot' }}
                                        <span v-if="order.items?.length > 1">va yana {{ order.items.length - 1 }}
                                            ta</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Total Amount -->
                        <div class="flex items-center gap-4 sm:flex-col sm:items-end">
                            <div class="text-right">
                                <p class="text-xs text-gray-500">Jami summa</p>
                                <p class="text-xl font-bold text-green-600">
                                    {{ formatCurrency(order.total_amount) }}
                                </p>
                            </div>
                            <span
                                class="text-primary-600 text-sm group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Order Modal -->
        <Teleport to="body">
            <CreateOrderModal v-if="showOrderModal" @submit="handleOrderSubmit" @close="closeOrderModal"
                :loading="orderLoading" />
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { useProductStore } from '@/stores/productStore'
import { useToast } from '@/plugins/toast'
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import CreateOrderModal from '@/components/orders/CreateOrder.vue'

const router = useRouter()
const orderStore = useOrderStore()
const productStore = useProductStore()
const toast = useToast()

// State
const searchQuery = ref('')
const sortBy = ref('newest')
const filterStatus = ref('all')
const showOrderModal = ref(false)
const orderLoading = ref(false)

// Computed
const orders = computed(() => orderStore.orders)
const loading = computed(() => orderStore.loading)
const error = computed(() => orderStore.error)

const totalOrders = computed(() => orders.value.length)

const todayCount = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return orders.value.filter(order => {
        const date = new Date(order.createdAt)
        date.setHours(0, 0, 0, 0)
        return date.getTime() === today.getTime()
    }).length
})

const weekCount = computed(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    return orders.value.filter(order => {
        const date = new Date(order.createdAt)
        return date >= weekAgo
    }).length
})

const monthCount = computed(() => {
    const now = new Date()
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    return orders.value.filter(order => {
        const date = new Date(order.createdAt)
        return date >= monthAgo
    }).length
})

// Filtered and Sorted Orders
const filteredOrders = computed(() => {
    let filtered = [...orders.value]

    // Status filter
    if (filterStatus.value === 'today') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        filtered = filtered.filter(order => {
            const date = new Date(order.createdAt)
            date.setHours(0, 0, 0, 0)
            return date.getTime() === today.getTime()
        })
    } else if (filterStatus.value === 'week') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(order => new Date(order.createdAt) >= weekAgo)
    } else if (filterStatus.value === 'month') {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        filtered = filtered.filter(order => new Date(order.createdAt) >= monthAgo)
    }

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(order =>
            order.id.toString().includes(query) ||
            order.items?.some(item =>
                item.product?.name?.toLowerCase().includes(query)
            )
        )
    }

    // Sort
    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt)
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt)
            case 'amount_desc':
                return b.total_amount - a.total_amount
            case 'amount_asc':
                return a.total_amount - b.total_amount
            default:
                return 0
        }
    })

    return filtered
})

onMounted(() => {
    fetchOrders()
    if (!productStore.products.length) {
        productStore.fetchProducts()
    }
})

const fetchOrders = async () => {
    try {
        await orderStore.fetchOrders()
    } catch (err) {
        console.error('Error fetching orders:', err)
    }
}

const viewOrder = (order) => {
    router.push(`/orders/${order.id}`)
}

const openOrderModal = () => {
    showOrderModal.value = true
}

const closeOrderModal = () => {
    showOrderModal.value = false
}

const handleOrderSubmit = async (orderData) => {
    orderLoading.value = true
    try {
        await orderStore.createOrder(orderData)
        toast.success('Buyurtma muvaffaqiyatli yaratildi!')
        closeOrderModal()
        await fetchOrders() // Yangilash
    } catch (err) {
        toast.error(err.message || 'Buyurtma yaratishda xatolik')
    } finally {
        orderLoading.value = false
    }
}

const clearSearch = () => {
    searchQuery.value = ''
    filterStatus.value = 'all'
}
</script>

<style scoped>
/* Animatsiyani olib tashladim - faqat scoped style qoldi */
.animate-fade-in {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>