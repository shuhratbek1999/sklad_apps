<template>
    <main class="min-h-[100dvh] min-w-0 bg-gray-50 dark:bg-gray-900">
        <div class="mx-auto w-full max-w-7xl min-w-0 pb-[calc(6rem+env(safe-area-inset-bottom))]">
            <!-- Sarlavha va qidiruv -->
            <header
                class="sticky top-0 z-40 border-b border-gray-200/70 bg-gray-50/95 px-2 py-3 backdrop-blur-md sm:px-5 lg:px-6 dark:border-gray-800 dark:bg-gray-900/95">
                <div
                    class="flex min-w-0 items-center gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm sm:gap-3 sm:p-3 dark:border-gray-700 dark:bg-gray-800">
                    <button type="button" aria-label="Orqaga qaytish"
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        @click="router.back()">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                            <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                        </svg>
                    </button>

                    <div class="min-w-0 flex-1">
                        <h1 class="truncate text-sm font-bold text-gray-900 sm:text-lg dark:text-white">
                            {{ currentCategory?.name || 'Kategoriya mahsulotlari' }}
                        </h1>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{ allProducts.length }} ta mahsulot
                        </p>
                    </div>

                    <button v-if="allProducts.length" type="button" :disabled="isMoving" :aria-pressed="isSelectionMode"
                        :class="isSelectionMode
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100'"
                        class="shrink-0 rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-50 sm:text-sm"
                        @click="toggleSelectionMode">
                        {{ isSelectionMode ? 'Bekor qilish' : 'Tanlash' }}
                    </button>
                </div>

                <!-- Qidiruv -->
                <div v-if="allProducts.length && !isSelectionMode" class="relative mt-3">
                    <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
                        aria-hidden="true">🔍</span>
                    <input v-model="productSearchQuery" type="search" aria-label="Mahsulotlarni qidirish"
                        placeholder="Mahsulot nomini kiriting..."
                        class="w-full min-w-0 rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>

                <!-- Tanlangan mahsulotlar soni -->
                <div v-if="isSelectionMode"
                    class="mt-3 flex items-center justify-between gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                    <span class="font-semibold">{{ selectedProductIds.length }} ta tanlandi</span>
                    <button v-if="selectedProductIds.length" type="button" :disabled="isMoving"
                        class="shrink-0 underline underline-offset-2 disabled:opacity-50" @click="clearSelection">
                        Tozalash
                    </button>
                </div>
            </header>

            <!-- Mahsulotlar -->
            <section class="px-2 pt-3 sm:px-5 sm:pt-4 lg:px-6">
                <!-- Loading -->
                <div v-if="isLoading"
                    class="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
                    aria-label="Mahsulotlar yuklanmoqda">
                    <div v-for="i in 8" :key="i"
                        class="overflow-hidden rounded-2xl border border-gray-100 bg-white animate-pulse dark:border-gray-700 dark:bg-gray-800">
                        <div class="aspect-[4/3] bg-gray-200 dark:bg-gray-700"></div>
                        <div class="space-y-2 p-3">
                            <div class="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
                            <div class="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                    </div>
                </div>

                <!-- API xatoligi -->
                <div v-else-if="loadError" role="alert"
                    class="rounded-2xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-900 dark:bg-red-950/20">
                    <p class="text-sm font-medium text-red-700 dark:text-red-300">{{ loadError }}</p>
                    <button type="button" class="mt-3 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
                        @click="loadCategory">
                        Qayta urinish
                    </button>
                </div>

                <!-- Mahsulot kartalari -->
                <div v-else-if="filteredProducts.length"
                    class="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                    <div v-for="product in filteredProducts" :key="product.id" class="relative min-w-0">
                        <!-- Tanlash belgisi -->
                        <div v-if="isSelectionMode" aria-hidden="true" :class="isSelected(product.id)
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-200 bg-white text-transparent dark:border-gray-600 dark:bg-gray-800'"
                            class="pointer-events-none absolute left-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-xl border-2 shadow-sm">
                            ✓
                        </div>

                        <!-- ProductCard hodisasi bir marta ishlaydi -->
                        <!-- {{ product }} -->
                        <ProductCard :product="product" :aria-label="isSelectionMode
                            ? `${product.name || 'Mahsulot'} tanlash`
                            : `${product.name || 'Mahsulot'} tafsiloti`"
                            :aria-pressed="isSelectionMode ? isSelected(product.id) : undefined" :class="[
                                'h-full w-full min-w-0 transition-all duration-150',
                                isSelectionMode && isSelected(product.id)
                                    ? 'rounded-2xl ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900'
                                    : ''
                            ]" @click="handleProductClick(product.id)" />
                    </div>
                </div>

                <!-- Qidiruv bo'sh -->
                <div v-else-if="allProducts.length"
                    class="rounded-2xl border border-gray-200 bg-white px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-800">
                    <span class="block text-4xl" aria-hidden="true">🔍</span>
                    <p class="mt-3 font-semibold text-gray-900 dark:text-white">Hech narsa topilmadi</p>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Qidiruvga mos mahsulot yo‘q.</p>
                    <button type="button" class="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
                        @click="productSearchQuery = ''">
                        Qidiruvni tozalash
                    </button>
                </div>

                <!-- Kategoriya bo'sh -->
                <div v-else
                    class="rounded-2xl border-2 border-dashed border-gray-200 bg-white px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-800">
                    <span class="block text-4xl" aria-hidden="true">📦</span>
                    <p class="mt-3 font-semibold text-gray-900 dark:text-white">Bu kategoriyada mahsulot yo‘q</p>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Hozircha mahsulotlar qo‘shilmagan.</p>
                    <button type="button" class="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
                        @click="goToAddProduct">
                        Mahsulot qo‘shish
                    </button>
                </div>
            </section>
        </div>

        <!-- Mobil: pastki ko'chirish paneli -->
        <div v-if="isSelectionMode && selectedProductIds.length"
            class="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div
                class="pointer-events-auto mx-auto flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white px-3 py-3 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                <span class="min-w-0 text-xs font-bold text-gray-800 sm:text-sm dark:text-white">
                    {{ selectedProductIds.length }} ta tanlandi
                </span>
                <button type="button" :disabled="isMoving"
                    class="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50 sm:text-sm"
                    @click="openMoveModal">
                    Ko‘chirish 📦
                </button>
            </div>
        </div>

        <!-- Ko'chirish modal oynasi -->
        <Teleport to="body">
            <div v-if="isMoveModalOpen"
                class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-4"
                @click.self="closeMoveModal" @keydown.esc="closeMoveModal">
                <div role="dialog" aria-modal="true" aria-labelledby="move-dialog-title"
                    class="my-auto w-full max-w-sm space-y-4 rounded-3xl bg-white p-4 shadow-2xl sm:p-6 dark:bg-gray-800">
                    <h2 id="move-dialog-title" class="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">
                        Qayerga ko‘chiramiz?
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Tanlangan {{ selectedProductIds.length }} ta mahsulot boshqa kategoriyaga o‘tkaziladi.
                    </p>

                    <select ref="targetSelect" v-model="targetCategoryId" aria-label="Yangi kategoriya"
                        :disabled="isMoving || !otherCategories.length"
                        class="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                        <option :value="null" disabled>Kategoriya tanlang</option>
                        <option v-for="category in otherCategories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>

                    <p v-if="!otherCategories.length" class="text-xs text-amber-700 dark:text-amber-300">
                        Ko‘chirish uchun boshqa kategoriya mavjud emas.
                    </p>

                    <div class="flex flex-col-reverse gap-2 min-[360px]:flex-row">
                        <button type="button" :disabled="isMoving"
                            class="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
                            @click="closeMoveModal">
                            Bekor qilish
                        </button>
                        <button type="button"
                            :disabled="targetCategoryId === null || isMoving || !otherCategories.length"
                            class="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                            @click="handleMoveProducts">
                            {{ isMoving ? 'Ko‘chirilmoqda...' : 'Tasdiqlash' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </main>
</template>

<script setup>
import { computed, nextTick, onActivated, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/categoryStore'
import { useToast } from '@/plugins/toast'
import ProductCard from '@/components/products/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()
const toast = useToast()

const productSearchQuery = ref('')
const isSelectionMode = ref(false)
const selectedProductIds = ref([])
const isMoveModalOpen = ref(false)
const targetCategoryId = ref(null)
const targetSelect = ref(null)
const isMoving = ref(false)
const isFetching = ref(false)
const loadError = ref('')

// Eski kategoriya mahsulotlarini yangi sahifada ko'rsatmaymiz
const currentCategory = computed(() => {
    const category = categoryStore.currentCategory
    return category && String(category.id) === String(route.params.id)
        ? category
        : null
})

const allProducts = computed(() => {
    const products = currentCategory.value?.products
    return Array.isArray(products) ? products : []
})

const isLoading = computed(() =>
    isFetching.value || (categoryStore.loading && !currentCategory.value)
)

const filteredProducts = computed(() => {
    const query = productSearchQuery.value.trim().toLocaleLowerCase()
    if (!query) return allProducts.value

    return allProducts.value.filter(product =>
        String(product.name ?? '').toLocaleLowerCase().includes(query)
    )
})

const otherCategories = computed(() => {
    const categories = categoryStore.categories
    return (Array.isArray(categories) ? categories : []).filter(
        category => String(category.id) !== String(route.params.id)
    )
})

const isSelected = id => selectedProductIds.value.some(
    selectedId => String(selectedId) === String(id)
)

function resetSelection() {
    isSelectionMode.value = false
    selectedProductIds.value = []
    isMoveModalOpen.value = false
    targetCategoryId.value = null
}

// API so'rovlarini ketma-ket yuborish
let latestRequest = 0
let loadQueue = Promise.resolve()

function loadCategory() {
    const id = route.params.id
    const request = ++latestRequest

    if (id == null || id === '') {
        isFetching.value = false
        loadError.value = 'Kategoriya identifikatori topilmadi.'
        return Promise.resolve()
    }

    isFetching.value = true
    loadError.value = ''

    const task = async () => {
        if (request !== latestRequest) return

        try {
            const result = await categoryStore.fetchCategoryProducts(id)

            if (request !== latestRequest) return

            if (result?.success === false) {
                throw new Error(
                    result.error || 'Kategoriya mahsulotlarini olishda xatolik'
                )
            }

            // Ko'chirish oynasi uchun kategoriyalar ro'yxati
            try {
                await categoryStore.fetchCategories()
            } catch (error) {
                console.warn('Kategoriyalar ro‘yxatini yuklab bo‘lmadi:', error)
            }

            if (request !== latestRequest) return

            if (!currentCategory.value) {
                throw new Error('Kategoriya ma’lumotlari topilmadi')
            }
        } catch (error) {
            if (request === latestRequest) {
                console.error('Kategoriya yuklash xatosi:', error)
                loadError.value =
                    'Mahsulotlarni yuklab bo‘lmadi. Qayta urinib ko‘ring.'
            }
        } finally {
            if (request === latestRequest) {
                isFetching.value = false
            }
        }
    }

    const pending = loadQueue.catch(() => { }).then(task)
    loadQueue = pending
    return pending
}

// Kategoriya almashganda qayta yuklash
watch(
    () => route.params.id,
    () => {
        resetSelection()
        productSearchQuery.value = ''
        loadCategory()
    },
    { immediate: true }
)

// KeepAlive ishlatilsa ma'lumotni yangilash
let firstActivation = true

onActivated(() => {
    if (firstActivation) {
        firstActivation = false
        return
    }

    loadCategory()
})

onBeforeUnmount(() => {
    latestRequest++
})

// Tanlash rejimi
function toggleSelectionMode() {
    if (isMoving.value) return

    isSelectionMode.value = !isSelectionMode.value
    selectedProductIds.value = []
    targetCategoryId.value = null
}

function clearSelection() {
    if (!isMoving.value) {
        selectedProductIds.value = []
    }
}

function handleProductClick(id) {
    if (isMoving.value) return

    if (!isSelectionMode.value) {
        router.push(`/product/${id}`)
        return
    }

    const index = selectedProductIds.value.findIndex(
        selectedId => String(selectedId) === String(id)
    )

    if (index === -1) {
        selectedProductIds.value.push(id)
    } else {
        selectedProductIds.value.splice(index, 1)
    }
}

// Ko'chirish oynasi
async function openMoveModal() {
    if (!selectedProductIds.value.length || isMoving.value) return

    targetCategoryId.value = null
    isMoveModalOpen.value = true

    await nextTick()
    targetSelect.value?.focus()
}

function closeMoveModal() {
    if (isMoving.value) return

    isMoveModalOpen.value = false
    targetCategoryId.value = null
}

// Mahsulotlarni boshqa kategoriyaga ko'chirish
async function handleMoveProducts() {
    if (
        isMoving.value ||
        !selectedProductIds.value.length ||
        targetCategoryId.value == null
    ) return

    isMoving.value = true

    try {
        const result = await categoryStore.moveProductsToCategory(
            [...selectedProductIds.value],
            targetCategoryId.value
        )

        if (!result?.success) {
            toast.error(result?.error || 'Mahsulotlarni ko‘chirib bo‘lmadi')
            return
        }

        toast.success(result.message || 'Mahsulotlar ko‘chirildi')

        resetSelection()
        await loadCategory()
    } catch (error) {
        console.error('Mahsulotlarni ko‘chirish xatosi:', error)
        toast.error('Xatolik yuz berdi. Qayta urinib ko‘ring.')
    } finally {
        isMoving.value = false
    }
}

function goToAddProduct() {
    router.push({
        path: '/add',
        query: { category_id: route.params.id }
    })
}
</script>
