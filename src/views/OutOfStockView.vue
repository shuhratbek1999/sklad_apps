<!-- src/views/OutOfStockView.vue -->
<template>
    <div class="h-[100dvh] overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto h-full flex flex-col animate-fade-in">

            <!-- Sticky top area -->
            <div
                class="sticky top-0 z-30 shrink-0 px-4 lg:px-6 pt-4 lg:pt-6 pb-4 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">

                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3 min-w-0">
                        <div
                            class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                            <span class="text-white text-2xl">⛔</span>
                        </div>

                        <div class="min-w-0">
                            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                                Tugagan mahsulotlar
                            </h1>
                            <p class="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                                Zaxirasi 0 bo'lgan mahsulotlar
                            </p>
                        </div>
                    </div>

                    <Button @click="$router.back()" variant="outline" icon="←" class="shrink-0">
                        Ortga
                    </Button>
                </div>

                <!-- Search + stats -->
                <div class="mt-4 flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                        <input v-model="searchQuery" type="text" placeholder="Mahsulot nomi bo‘yicha qidirish..."
                            class="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400" />
                        <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
                    </div>

                    <div
                        class="shrink-0 px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Jami: {{ filteredProducts.length }}
                    </div>
                </div>
            </div>

            <!-- Scrollable content -->
            <div class="flex-1 overflow-y-auto px-4 lg:px-6 pb-24 pt-4 custom-scroll">

                <!-- Loading State -->
                <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                    <Spinner size="lg" />
                    <p class="mt-4 text-gray-500">Ma'lumotlar yuklanmoqda...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="error"
                    class="text-center py-12 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900">
                    <p class="text-red-600 mb-4 font-medium">❌ {{ error }}</p>
                    <Button @click="refreshData" variant="primary">Qayta urinish</Button>
                </div>

                <!-- Products Grid -->
                <div v-else-if="filteredProducts.length"
                    class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product"
                        @click="viewProduct(product)" />
                </div>

                <!-- Empty search result -->
                <div v-else-if="outOfStockProducts.length && !filteredProducts.length"
                    class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-4xl">🔍</span>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Hech narsa topilmadi
                    </h3>
                    <p class="text-gray-500 mb-6">
                        Qidiruv bo‘yicha mos mahsulot topilmadi
                    </p>
                    <Button @click="searchQuery = ''" variant="primary">
                        Qidiruvni tozalash
                    </Button>
                </div>

                <!-- Empty State -->
                <div v-else
                    class="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-4xl">✅</span>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Barcha mahsulotlar bor!
                    </h3>
                    <p class="text-gray-500 mb-6">Tugagan mahsulotlar mavjud emas</p>
                    <Button @click="$router.push('/')" variant="primary">
                        Asosiy sahifaga qaytish
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductWithStats } from '@/composables/useProductWithStats'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import ProductCard from '@/components/products/ProductCard.vue'

const router = useRouter()
const searchQuery = ref('')

const {
    outOfStockProducts,
    loading,
    error,
    fetchProducts
} = useProductWithStats()

onMounted(() => {
    fetchProducts()
})

const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()

    if (!query) return outOfStockProducts.value || []

    return (outOfStockProducts.value || []).filter(product =>
        (product.name || '').toLowerCase().includes(query)
    )
})

const refreshData = () => {
    fetchProducts()
}

const viewProduct = (product) => {
    router.push(`/product/${product.id}`)
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.35s ease-out;
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

.custom-scroll {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
}

.custom-scroll::-webkit-scrollbar {
    width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.35);
    border-radius: 9999px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(239, 68, 68, 0.55);
}
</style>