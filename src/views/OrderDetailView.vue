<template>
    <div class="animate-fade-in p-3 sm:p-4 lg:p-6 max-w-5xl mx-auto overflow-y-auto">
        <div class="mb-4 sm:mb-6">
            <Button @click="$router.back()" variant="outline" size="sm" class="group hover:bg-gray-100">
                <span class="mr-2 group-hover:-translate-x-1 transition-transform inline-block">←</span>
                <span class="hidden xs:inline">Ortga</span>
                <span class="xs:hidden">Orqaga</span>
            </Button>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-16 sm:py-20">
            <Spinner size="lg" />
            <p class="mt-4 text-sm sm:text-base text-gray-500">Buyurtma ma'lumotlari yuklanmoqda...</p>
        </div>

        <div v-else-if="error" class="text-center py-10 sm:py-12 bg-red-50 rounded-xl border border-red-100">
            <span class="text-4xl sm:text-5xl mb-3 sm:mb-4 block">❌</span>
            <p class="text-red-600 mb-3 sm:mb-4 font-medium text-sm sm:text-base px-4">{{ error }}</p>
            <Button @click="fetchData" variant="primary" size="sm">Qayta urinish</Button>
        </div>

        <div v-else-if="order" class="space-y-4 sm:space-y-6">
            <Card class="border-l-4 border-l-green-500 overflow-hidden">
                <div class="p-2 sm:p-4">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div class="flex items-start gap-3 sm:gap-4">
                            <div
                                class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <span class="text-white text-xl sm:text-2xl">📋</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h1 class="text-xl sm:text-2xl font-bold text-gray-900 truncate">Buyurtma #{{ order.id
                                    }}</h1>
                                <div
                                    class="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                                    <span>📅 {{ formatDate(order.order_date || order.createdAt) }}</span>
                                    <span class="hidden xs:inline text-gray-300">|</span>
                                    <span>⏰ {{ formatTime(order.createdAt) }}</span>
                                </div>
                                <span v-if="confirmed"
                                    class="inline-flex items-center gap-1 mt-2 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                    ✅ Tasdiqlangan
                                </span>
                            </div>
                        </div>
                        <div class="bg-green-50 p-3 sm:p-4 rounded-xl w-full sm:w-auto">
                            <p class="text-xs text-green-600 font-medium">JAMI SUMMA</p>
                            <p class="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 break-words">
                                {{ formatCurrency(order.total_amount) }}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card class="overflow-hidden">
                <div class="p-4 sm:p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <span>📦 Mahsulotlar</span>
                    </h3>
                    <span class="text-xs sm:text-sm bg-white px-2 sm:px-3 py-1 rounded-full border border-gray-200">
                        {{ order.items?.length || 0 }} ta
                    </span>
                </div>

                <div class="divide-y divide-gray-100 max-h-[300px] overflow-y-auto custom-scrollbar">
                    <div v-for="(item, index) in order.items" :key="item.id || index"
                        class="p-2 hover:bg-gray-50/50 transition-colors">
                        <div class="flex flex-col xs:flex-row gap-4">
                            <div
                                class="flex-shrink-0 mx-auto xs:mx-0 w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                                <img v-if="item.product?.image_url" :src="getImageUrl(item.product.image_url)"
                                    class="w-full h-full object-cover" @error="handleImageError" />
                                <span v-else class="text-2xl text-gray-400">📦</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div class="text-center xs:text-left">
                                        <h4 class="font-semibold text-gray-900 text-base sm:text-lg truncate">{{
                                            item.product?.name }}</h4>
                                        <p class="text-xs text-gray-500">Mavjud: {{ item.product?.quantity || 0 }} ta
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-3">
                                        <div class="text-center">
                                            <p class="text-[10px] text-gray-400">Soni</p>
                                            <p class="font-semibold text-xs">{{ item.quantity }}</p>
                                        </div>
                                        <div class="text-center">
                                            <p class="text-[10px] text-gray-400">Narxi</p>
                                            <p class="font-semibold text-xs">{{ formatCurrency(item.price) }}</p>
                                        </div>
                                        <div class="text-center">
                                            <p class="text-[10px] text-gray-400">Jami</p>
                                            <p class="font-bold text-primary-600 text-xs">{{
                                                formatCurrency(item.quantity * item.price) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card v-if="!confirmed" class="border-l-4 border-l-blue-500">
                <div class="p-4 sm:p-6">
                    <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2"><span>✏️</span> Tasdiqlash va
                        Tahrirlash</h3>

                    <div class="space-y-4">
                        <div v-for="(item, index) in formItems" :key="index"
                            class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p class="text-sm font-bold text-gray-800 mb-3 truncate">{{ item.product?.name }}</p>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Soni
                                        (Mavjud: {{ item.product?.quantity }})</label>
                                    <input v-model.number="item.quantity" type="number"
                                        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        :class="{ 'border-red-500 bg-red-50': item.quantity > (item.product?.quantity || 0) }" />
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Narxi
                                        (₩)</label>
                                    <input v-model.number="item.price" type="number"
                                        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>

                        <div class="bg-blue-600 p-4 rounded-xl text-white flex justify-between items-center shadow-lg">
                            <span class="text-sm font-medium">Yangi Jami Summa:</span>
                            <span class="text-sm font-black">{{ formatCurrency(newTotalAmount) }}</span>
                        </div>

                        <div class="flex flex-col-reverse xs:flex-row xs:justify-end gap-3 pt-2">
                            <Button @click="showDeleteModal = true" variant="outline"
                                class="text-red-600 border-red-200">Bekor qilish</Button>
                            <Button @click="confirmOrder" variant="success" :loading="confirmLoading"
                                :disabled="!isValidForm">Tasdiqlash</Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Card v-else class="bg-green-50 border-none p-8 text-center">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-4xl">✅</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Buyurtma Tasdiqlandi!</h3>
                <p class="text-sm text-gray-600">Ilova avtomatik ravishda {{ autoDeleteTime }} sekundda yangilanadi.</p>
                <div class="mt-4 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-green-500 transition-all duration-1000"
                        :style="{ width: (autoDeleteTime * 10) + '%' }"></div>
                </div>
            </Card>
        </div>

        <div v-if="showDeleteModal"
            class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                class="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in">
                <div class="p-6 text-center">
                    <div
                        class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        ⚠️</div>
                    <h3 class="text-lg font-bold text-gray-900">O'chirilsinmi?</h3>
                    <p class="text-sm text-gray-500 mt-2">Bu buyurtma bazadan butunlay o'chib ketadi. Rozimisiz?</p>
                </div>
                <div class="flex border-t border-gray-100">
                    <button @click="showDeleteModal = false"
                        class="flex-1 py-4 text-gray-500 font-medium hover:bg-gray-50 transition-colors">Yo'q</button>
                    <button @click="handleDeleteOrder" :disabled="deleteLoading"
                        class="flex-1 py-4 text-red-600 font-bold hover:bg-red-50 border-l border-gray-100">
                        {{ deleteLoading ? '...' : 'Ha, o\'chirilsin' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { useProductStore } from '@/stores/productStore'
import { useImageUpload } from '@/composables/useImageUpload'
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters'
import { useToast } from '@/plugins/toast'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id
const toast = useToast()

const orderStore = useOrderStore()
const productStore = useProductStore()
const { getImageUrl } = useImageUpload()

const order = computed(() => orderStore.currentOrder)
const loading = computed(() => orderStore.loading)
const error = computed(() => orderStore.error)

const formItems = ref([])
const confirmLoading = ref(false)
const confirmed = ref(false)
const autoDeleteTime = ref(10)
const deleteTimer = ref(null)

const showDeleteModal = ref(false)
const deleteLoading = ref(false)

onMounted(() => fetchData())
onUnmounted(() => deleteTimer.value && clearInterval(deleteTimer.value))

const fetchData = async () => {
    try {
        await orderStore.fetchOrderById(orderId)
        if (order.value?.items) {
            formItems.value = order.value.items.map(item => ({
                product_id: item.product_id,
                product: item.product,
                quantity: item.quantity,
                price: item.price
            }))
        }
    } catch (err) { console.error(err) }
}

const newTotalAmount = computed(() => {
    return formItems.value.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || 0)), 0)
})

const isValidForm = computed(() => {
    return formItems.value.length > 0 && formItems.value.every(item =>
        item.quantity > 0 && item.quantity <= (item.product?.quantity || 0)
    )
})

const handleDeleteOrder = async () => {
    deleteLoading.value = true
    try {
        await orderStore.deleteOrder(orderId)
        showDeleteModal.value = false
        toast.success('Buyurtma o\'chirildi')
        router.push('/')
    } catch (err) {
        toast.error('O\'chirishda xatolik!')
    } finally { deleteLoading.value = false }
}

const confirmOrder = async () => {
    confirmLoading.value = true
    try {
        await orderStore.confirmOrder(orderId, {
            items: formItems.value.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price }))
        })
        confirmed.value = true
        await productStore.fetchProducts()
        toast.success('Tasdiqlandi!')

        deleteTimer.value = setInterval(() => {
            autoDeleteTime.value--
            if (autoDeleteTime.value <= 0) {
                clearInterval(deleteTimer.value)
                autoDeleteOrder()
            }
        }, 1000)
    } catch (err) { toast.error('Xatolik!') } finally { confirmLoading.value = false }
}

const autoDeleteOrder = async () => {
    try {
        await orderStore.autoDeleteOrder(orderId)
        router.push('/')
    } catch (err) { console.error(err) }
}

const handleImageError = (e) => {
    e.target.style.display = 'none'
    e.target.parentElement.innerHTML = '<span class="text-2xl text-gray-400">📦</span>'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 10px;
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
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