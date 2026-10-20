<template>
    <div class="h-[100dvh] overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div class="h-full flex flex-col animate-fade-in max-w-7xl mx-auto">

            <!-- Sticky Header -->
            <div
                class="sticky top-0 z-40 shrink-0 px-2 lg:px-6 pt-2 lg:pt-6 pb-4 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 space-y-4">

                <!-- Top Bar -->
                <div
                    class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center gap-4 min-w-0">
                        <button @click="router.back()"
                            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors shrink-0">
                            <svg class="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div v-if="categoryStore.currentCategory" class="flex items-center gap-3 min-w-0">
                            <div class="min-w-0">
                                <h1
                                    class="text-base sm:text-lg font-bold leading-tight text-gray-900 dark:text-white truncate">
                                    {{ categoryStore.currentCategory.name }}
                                </h1>
                                <p class="text-xs text-gray-500 truncate">
                                    {{ categoryStore.currentCategory.products?.length || 0 }} ta mahsulot
                                </p>
                            </div>
                        </div>
                    </div>

                    <button v-if="filteredProducts.length" @click="toggleSelectionMode" :class="isSelectionMode
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200'"
                        class="px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0">
                        {{ isSelectionMode ? 'Bekor qilish' : 'Tanlash' }}
                    </button>
                </div>

                <!-- Search -->
                <div v-if="categoryStore.currentCategory?.products?.length && !isSelectionMode" class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
                    <input v-model="productSearchQuery" type="text" placeholder="Mahsulot nomini kiriting..."
                        class="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-gray-900 dark:text-white placeholder:text-gray-400" />
                </div>

                <!-- Selection info -->
                <div v-if="isSelectionMode" class="flex items-center justify-between gap-3">
                    <div
                        class="px-4 py-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-sm font-semibold text-blue-700 dark:text-blue-300">
                        Tanlanganlar: {{ selectedProductIds.length }}
                    </div>

                    <button v-if="selectedProductIds.length" @click="openMoveModal"
                        class="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                        Ko'chirish 📦
                    </button>
                </div>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto px-2 lg:px-6 pb-28 pt-4 custom-scroll">

                <!-- Loading -->
                <div v-if="categoryStore.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    <div v-for="i in 8" :key="i" class="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl">
                    </div>
                </div>

                <!-- Product Grid -->
                <div v-else-if="filteredProducts.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    <div v-for="product in filteredProducts" :key="product.id" class="relative group"
                        @click="handleProductClick(product.id)">
                        <!-- Selection Badge -->
                        <div v-if="isSelectionMode" class="absolute top-3 left-3 z-20 pointer-events-none">
                            <div :class="[
                                'w-9 h-9 rounded-xl border-2 flex items-center justify-center shadow-md transition-all font-bold text-sm',
                                selectedProductIds.includes(product.id)
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white/90 dark:bg-gray-800/90 border-white dark:border-gray-600 text-transparent'
                            ]">
                                ✓
                            </div>
                        </div>

                        <!-- Tap overlay for selection mode -->
                        <div v-if="isSelectionMode" :class="[
                            'absolute inset-0 z-10 rounded-2xl transition-all',
                            selectedProductIds.includes(product.id)
                                ? 'bg-blue-500/10'
                                : 'bg-transparent'
                        ]"></div>

                        <ProductCard :product="product" :class="[
                            'transition-all duration-200 cursor-pointer select-none',
                            isSelectionMode && selectedProductIds.includes(product.id)
                                ? 'ring-2 ring-blue-500 rounded-2xl shadow-lg shadow-blue-100 scale-[0.98]'
                                : '',
                            isSelectionMode && !selectedProductIds.includes(product.id)
                                ? 'opacity-95'
                                : ''
                        ]" />
                    </div>
                </div>

                <!-- Empty search result -->
                <div v-else-if="categoryStore.currentCategory?.products?.length && !filteredProducts.length"
                    class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-4xl">🔍</span>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Hech narsa topilmadi
                    </h3>
                    <p class="text-gray-500 mb-6">
                        Qidiruv bo‘yicha mos mahsulot topilmadi
                    </p>
                    <button @click="productSearchQuery = ''"
                        class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all">
                        Qidiruvni tozalash
                    </button>
                </div>

                <!-- Empty category -->
                <div v-else
                    class="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div
                        class="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-4xl">📦</span>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Bu kategoriyada mahsulot yo‘q
                    </h3>
                    <p class="text-gray-500 mb-6">
                        Hozircha bu kategoriya ichida mahsulot mavjud emas
                    </p>
                    <button @click="goToAddProduct"
                        class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all">
                        Mahsulot qo‘shish
                    </button>
                </div>
            </div>

            <!-- Bottom Floating Action -->
            <div v-if="isSelectionMode && selectedProductIds.length"
                class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-4 rounded-3xl shadow-2xl border border-blue-100 dark:border-gray-700 flex items-center gap-6 z-[60] animate-bounce-in">
                <span class="text-sm font-bold text-gray-700 dark:text-white">
                    {{ selectedProductIds.length }} ta tanlandi
                </span>
                <button @click="openMoveModal"
                    class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                    Ko'chirish 📦
                </button>
            </div>

            <!-- Move Modal -->
            <div v-if="isMoveModalOpen"
                class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div class="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Qayerga ko'chiramiz?</h3>
                    <p class="text-sm text-gray-500">Tanlangan mahsulotlar yangi kategoriyaga o'tkaziladi.</p>

                    <select v-model="targetCategoryId"
                        class="w-full p-3 border border-gray-100 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                        <option value="" disabled>Kategoriya tanlang</option>
                        <option v-for="cat in otherCategories" :key="cat.id" :value="cat.id">
                            {{ cat.name }}
                        </option>
                    </select>

                    <div class="flex gap-3">
                        <button @click="isMoveModalOpen = false"
                            class="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl">
                            Bekor qilish
                        </button>
                        <button @click="handleMoveProducts" :disabled="!targetCategoryId || categoryStore.loading"
                            class="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold disabled:opacity-50">
                            {{ categoryStore.loading ? '...' : 'Tasdiqlash' }}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCategoryStore } from "@/stores/categoryStore";
import { useToast } from "@/plugins/toast";
import ProductCard from "@/components/products/ProductCard.vue";

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const toast = useToast();

const productSearchQuery = ref("");
const isSelectionMode = ref(false);
const selectedProductIds = ref([]);
const isMoveModalOpen = ref(false);
const targetCategoryId = ref(null);

const filteredProducts = computed(() => {
    const products = categoryStore.currentCategory?.products || [];
    const query = productSearchQuery.value.toLowerCase().trim();

    if (!query) return products;

    return products.filter((product) =>
        product.name.toLowerCase().includes(query)
    );
});

const otherCategories = computed(() => {
    return categoryStore.categories.filter((c) => c.id != route.params.id);
});

onMounted(async () => {
    const categoryId = route.params.id;
    if (categoryId) {
        await categoryStore.fetchCategoryProducts(categoryId);
        await categoryStore.fetchCategories();
    }
});

const toggleSelectionMode = () => {
    isSelectionMode.value = !isSelectionMode.value;

    if (!isSelectionMode.value) {
        selectedProductIds.value = [];
    }
};

const toggleProductSelection = (productId) => {
    const index = selectedProductIds.value.indexOf(productId);

    if (index > -1) {
        selectedProductIds.value.splice(index, 1);
    } else {
        selectedProductIds.value.push(productId);
    }
};

const handleProductClick = (productId) => {
    if (isSelectionMode.value) {
        toggleProductSelection(productId);
    } else {
        viewProduct(productId);
    }
};

const openMoveModal = () => {
    if (selectedProductIds.value.length) {
        isMoveModalOpen.value = true;
    }
};

const handleMoveProducts = async () => {
    const result = await categoryStore.moveProductsToCategory(
        selectedProductIds.value,
        targetCategoryId.value
    );

    if (result.success) {
        toast.success(result.message);
        isMoveModalOpen.value = false;
        isSelectionMode.value = false;
        selectedProductIds.value = [];
        targetCategoryId.value = null;

        await categoryStore.fetchCategoryProducts(route.params.id);
    } else {
        toast.error(result.error);
    }
};

const viewProduct = (id) => router.push(`/product/${id}`);

const goToAddProduct = () => {
    router.push({ path: "/add", query: { category_id: route.params.id } });
};
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
    background: rgba(59, 130, 246, 0.35);
    border-radius: 9999px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.55);
}

.animate-bounce-in {
    animation: bounceIn 0.25s ease-out;
}

@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: translateX(-50%) translateY(20px) scale(0.95);
    }

    100% {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
    }
}
</style>