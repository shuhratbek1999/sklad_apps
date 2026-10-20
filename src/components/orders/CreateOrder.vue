<template>
    <Transition :name="isMobile ? 'slide-up' : 'modal'">
        <div class="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
            <div class="fixed inset-0 bg-black/50" @click="$emit('close')"></div>
            <div :class="[
                'relative bg-white shadow-xl transition-all',
                isMobile
                    ? 'w-full rounded-t-2xl max-h-[90vh] overflow-hidden animate-slide-up'
                    : 'w-full max-w-2xl rounded-2xl max-h-[90vh] overflow-hidden'
            ]">
                <!-- Drag indicator (mobile) -->
                <div v-if="isMobile" class="sticky top-0 bg-white pt-3 pb-1 z-20">
                    <div class="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>
                </div>

                <!-- Header -->
                <div :class="[
                    'sticky top-0 bg-white z-10',
                    isMobile ? 'px-4 pb-2' : 'px-6 py-4 border-b'
                ]">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                            <span class="mr-2">🛒</span> Yangi Buyurtma
                        </h2>
                        <button @click="$emit('close')"
                            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <span class="text-xl">✕</span>
                        </button>
                    </div>
                </div>

                <!-- Content -->
                <div class="overflow-y-auto" :class="isMobile ? 'p-4' : 'p-6'" style="max-height: calc(90vh - 120px);">

                    <!-- Tanlangan mahsulotlar -->
                    <div v-if="items.length" class="mb-5">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-gray-700 flex items-center">
                                <span class="mr-1">📦</span> Tanlangan mahsulotlar
                            </span>
                            <span class="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                                {{ items.length }} ta
                            </span>
                        </div>

                        <div class="space-y-2">
                            <div v-for="(item, index) in items" :key="index"
                                class="group flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div
                                    class="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                                    📦
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-medium text-gray-900 truncate">{{ item.product.name }}</p>
                                    <div class="flex items-center justify-between mt-0.5">
                                        <span class="text-sm text-gray-600">
                                            {{ item.quantity }} × {{ formatCurrency(item.product.price) }}
                                        </span>
                                        <span class="text-sm font-semibold text-primary-600">
                                            {{ formatCurrency(item.quantity * item.product.price) }}
                                        </span>
                                    </div>
                                </div>
                                <button @click="removeItem(index)"
                                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                                    title="O'chirish">
                                    <span class="text-lg">🗑️</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Mahsulot qo'shish -->
                    <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 mb-5 border border-gray-100">
                        <h3 class="text-sm font-medium text-gray-800 mb-3 flex items-center">
                            <span class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                                <span class="text-primary-600">+</span>
                            </span>
                            Mahsulot qo'shish
                        </h3>

                        <!-- 🔍 SEARCH INPUT -->
                        <div class="mb-3">
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                <input v-model="searchQuery" type="text" placeholder="Mahsulot nomini kiriting..."
                                    class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                                    @input="handleSearch" />
                                <button v-if="searchQuery" @click="clearSearch"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    ✕
                                </button>
                            </div>
                        </div>

                        <!-- Mahsulotlar ro'yxati (scrollable) -->
                        <div class="max-h-60 overflow-y-auto mb-3 border border-gray-100 rounded-xl">
                            <div v-for="product in filteredProducts" :key="product.id" @click="selectProduct(product)"
                                class="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                :class="{ 'bg-primary-50 border-primary-200': selectedProduct?.id === product.id }">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                        📦
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">{{ product.name }}</p>
                                        <p class="text-xs text-gray-500">
                                            Mavjud: {{ product.quantity }} ta |
                                            Narx: {{ formatCurrency(product.price) }}
                                        </p>
                                    </div>
                                </div>
                                <div v-if="selectedProduct?.id === product.id" class="text-primary-600">
                                    ✅
                                </div>
                            </div>
                            <div v-if="!filteredProducts.length" class="p-8 text-center text-gray-500">
                                <p class="text-sm">Mahsulot topilmadi</p>
                            </div>
                        </div>

                        <!-- Quantity (faqat soni) -->
                        <div v-if="selectedProduct" class="mb-3">
                            <label class="block text-xs font-medium text-gray-600 mb-1.5">
                                <span class="flex items-center gap-1">
                                    <span>🔢</span> Soni
                                </span>
                            </label>
                            <div class="flex items-center gap-2">
                                <input v-model.number="quantity" type="number" min="1" :max="selectedProduct?.quantity"
                                    class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    :class="{ 'border-red-500 bg-red-50': quantity > selectedProduct?.quantity }"
                                    placeholder="0" />
                                <span class="text-sm text-gray-500">
                                    / {{ selectedProduct?.quantity }} ta
                                </span>
                            </div>
                            <p v-if="quantity > selectedProduct?.quantity" class="mt-1 text-xs text-red-600">
                                ⚠️ Mavjud miqdordan ko'p
                            </p>
                        </div>

                        <!-- Add Button -->
                        <button @click="addItem" :disabled="!canAddItem" class="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-medium 
                                disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                                hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                                flex items-center justify-center gap-2 shadow-sm mt-2">
                            <span class="text-lg">➕</span>
                            <span>Mahsulotni qo'shish</span>
                        </button>
                    </div>

                    <!-- Jami summa -->
                    <div
                        class="bg-gradient-to-br from-primary-50 to-white rounded-xl p-4 mb-2 border border-primary-100">
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="text-sm font-medium text-gray-700">Jami summa</span>
                                <p class="text-xs text-gray-500 mt-0.5">Barcha mahsulotlar bo'yicha</p>
                            </div>
                            <div class="text-right">
                                <span class="md:text-2xl font-bold text-primary-700">
                                    {{ formatCurrency(totalAmount) }}
                                </span>
                                <span class="text-xs text-gray-500 block">UZS</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div :class="[
                    'sticky bottom-0 bg-white border-t border-gray-200',
                    isMobile ? 'p-4' : 'p-6'
                ]">
                    <div class="grid grid-cols-2 gap-3">
                        <button @click="$emit('close')" class="py-3 px-4 border-2 border-gray-200 rounded-xl font-medium text-gray-700 
                                hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]">
                            Bekor qilish
                        </button>
                        <button @click="submitOrder" :disabled="!items.length || loading" class="py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium 
                                disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                                hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                                flex items-center justify-center gap-2 shadow-sm">
                            <span v-if="loading" class="flex items-center gap-2">
                                <span
                                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Yuklanmoqda...
                            </span>
                            <span v-else class="flex items-center gap-2 text-sm">
                                Buyurtmani saqlash
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { formatCurrency } from '@/utils/formatters';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['submit', 'close']);

const productStore = useProductStore();

// Screen size detection
const isMobile = ref(window.innerWidth < 768);

const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
    window.addEventListener('resize', checkScreenSize);
    if (!productStore.products.length) {
        productStore.fetchProducts();
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
});

// Form state
const searchQuery = ref('');
const selectedProduct = ref(null);
const quantity = ref('');
const items = ref([]);

// Computed
const availableProducts = computed(() => {
    return productStore.products.filter(p => p.quantity > 0);
});

// 🔍 Filtered products based on search
const filteredProducts = computed(() => {
    if (!searchQuery.value) {
        return availableProducts.value.slice(0, 5); // Show first 5 if no search
    }

    const query = searchQuery.value.toLowerCase();
    return availableProducts.value.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.id.toString().includes(query)
    );
});

const canAddItem = computed(() => {
    return selectedProduct.value &&
        quantity.value > 0 &&
        quantity.value <= selectedProduct.value.quantity;
});

const totalAmount = computed(() => {
    return items.value.reduce((sum, item) => {
        return sum + (item.quantity * item.product.price); // Use product.price
    }, 0);
});

// Methods
const handleSearch = () => {
    // Auto-select if only one result
    if (filteredProducts.value.length === 1 && !selectedProduct.value) {
        selectedProduct.value = filteredProducts.value[0];
    }
};

const clearSearch = () => {
    searchQuery.value = '';
    selectedProduct.value = null;
};

const selectProduct = (product) => {
    selectedProduct.value = product;
    quantity.value = ''; // Reset quantity
};

const addItem = () => {
    items.value.push({
        product_id: selectedProduct.value.id,
        product: selectedProduct.value,
        quantity: Number(quantity.value),
        price: selectedProduct.value.price // Use current product price
    });

    // Reset form
    selectedProduct.value = null;
    quantity.value = '';
    searchQuery.value = '';
};

const removeItem = (index) => {
    items.value.splice(index, 1);
};

const submitOrder = () => {
    const orderData = {
        items: items.value.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.product.price // Send current product price
        })),
        order_date: new Date().toISOString().split('T')[0]
    };

    emit('submit', orderData);
};
</script>

<style scoped>
.input {
    @apply px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all;
}

/* Desktop Modal Animation */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
    opacity: 1;
    transform: scale(1);
}

/* Mobile Slide Up Animation */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}

.slide-up-enter-to,
.slide-up-leave-from {
    transform: translateY(0);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Product list scrollbar */
.max-h-60::-webkit-scrollbar {
    width: 4px;
}

.max-h-60::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.max-h-60::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 4px;
}
</style>