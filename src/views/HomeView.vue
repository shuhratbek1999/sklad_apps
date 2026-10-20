<template>
  <div class="animate-fade-in px-2 py-3 sm:p-4 lg:p-6 space-y-5">

    <!-- Statistika -->
    <div class="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      <StatsCard title="Jami mahsulotlar" :value="totalProducts" icon="📦" color="primary" :loading="loading"
        @click="router.push('/')" />
      <StatsCard title="Umumiy qiymat" :value="formatCurrency(totalValue)" icon="💰" color="success" :loading="loading"
        @click="router.push('/')" />
      <StatsCard title="Kam zaxira" :value="lowStockCount" icon="⚠️" color="warning" :loading="loading"
        @click="goToLowStock" />
      <StatsCard title="Tugaganlar" :value="outOfStockCount" icon="⛔" color="danger" :loading="loading"
        @click="goToOutOfStock" />
      <StatsCard title="Mijozlar qarzi" :value="formatCurrency(totalDebts)" icon="📉" color="danger"
        :loading="debtStore.loading" @click="router.push('/debts')" />
      <StatsCard title="Bizning qarzimiz" :value="formatCurrency(totalCredits)" icon="📈" color="info"
        :loading="debtStore.loading" @click="router.push('/credits')" />
    </div>

    <!-- Bugungi buyurtmalar -->
    <Card class="overflow-hidden border-l-4 border-l-green-500">
      <div class="p-3 sm:p-4">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 shrink-0 bg-green-100 rounded-xl flex items-center justify-center">
              <span class="text-xl">📋</span>
            </div>

            <div class="min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
                Bugungi buyurtmalar
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ todayDate }}
              </p>
            </div>
          </div>

          <div class="text-right shrink-0">
            <p class="text-sm sm:text-base font-bold text-green-600">
              {{ formatCurrency(todayTotal) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ todayOrders.length }} ta buyurtma
            </p>
          </div>
        </div>

        <div v-if="todayOrders.length === 0" class="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <span class="text-4xl mb-2 block">📭</span>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Bugun buyurtmalar yo'q
          </p>
        </div>

        <div v-else class="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          <div v-for="order in todayOrders" :key="order.id" @click="viewOrder(order)"
            class="flex items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer transition-all border border-transparent hover:border-green-200">
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <span
                class="text-[10px] shrink-0 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-1.5 py-1 rounded">
                {{ formatTime(order.createdAt) }}
              </span>

              <p class="min-w-0 text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ order.items?.[0]?.product?.name || 'Buyurtma' }}
              </p>

              <span v-if="order.items?.length > 1"
                class="shrink-0 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                +{{ order.items.length - 1 }}
              </span>
            </div>

            <div class="text-right shrink-0 text-sm font-bold text-green-600 dark:text-green-400">
              {{ formatCurrency(order.total_amount) }}
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Yuklashda xatolik -->
    <div v-if="loadError" class="p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
      <p>{{ loadError }}</p>
      <button type="button" class="mt-2 font-semibold underline" @click="refreshData">
        Qayta urinish
      </button>
    </div>

    <!-- Kategoriyalar -->
    <section class="space-y-4">
      <div class="relative">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
          🔍
        </span>
        <input v-model="searchQuery" type="search" placeholder="Kategoriyalarni qidirish..."
          class="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
      </div>

      <!-- Skeleton -->
      <div v-if="categoryStore.loading"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        <div v-for="i in 5" :key="i"
          class="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-pulse">
          <div class="aspect-[4/3] bg-gray-200 dark:bg-gray-700"></div>
          <div class="p-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Category cards -->
      <div v-else-if="filteredCategories.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        <div v-for="category in filteredCategories" :key="category.id" role="button" tabindex="0"
          @click="openCategory(category)" @keydown.enter="openCategory(category)"
          @keydown.space.prevent="openCategory(category)"
          class="group relative min-w-0 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
          <!-- Mahsulot soni -->
          <div
            class="absolute top-2 right-2 z-10 bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
            {{ category.products?.length ?? category.product_count ?? category.products_count ?? 0 }}
          </div>

          <!-- RASM: proporsiya saqlanadi -->
          <div
            class="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <img v-if="
              category.displayImage &&
              failedImages[category.id] !== category.displayImage
            " :src="category.displayImage" :alt="category.name || 'Kategoriya rasmi'"
              class="block w-full h-full object-contain object-center p-2 transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy" decoding="async" @error="handleImageError(category)" />

            <!-- Rasm bo'lmasa yoki ochilmasa -->
            <div v-else
              class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
              <span class="text-4xl" aria-hidden="true">📦</span>
              <span class="text-[11px] text-center px-2">
                Rasm mavjud emas
              </span>
            </div>
          </div>

          <!-- Kategoriya nomi -->
          <div class="p-3 text-center border-t border-gray-100 dark:border-gray-700">
            <h3
              class="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm leading-5 line-clamp-2 min-h-[20px]"
              :title="category.name">
              {{ category.name }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <span class="text-4xl block mb-3">📂</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ searchQuery.trim() ? 'Bunday kategoriya topilmadi' : 'Hozircha kategoriyalar mavjud emas' }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onActivated, computed, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { useProductWithStats } from '@/composables/useProductWithStats'
import { useOrderStore } from '@/stores/orderStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useDebtStore } from '@/stores/debtStore'
import { useImageUpload } from '@/composables/useImageUpload'

import { formatCurrency, formatTime } from '@/utils/formatters'

import Card from '@/components/ui/Card.vue'
import StatsCard from '@/components/products/StatsCard.vue'

const router = useRouter()

const orderStore = useOrderStore()
const categoryStore = useCategoryStore()
const debtStore = useDebtStore()

const { getImageUrl } = useImageUpload()

const searchQuery = ref('')
const loadError = ref('')
const failedImages = reactive({})

const {
  loading,
  totalProducts,
  totalValue,
  lowStockCount,
  outOfStockCount,
  fetchProducts
} = useProductWithStats()

// Yangi mijozning upload serveri
const UPLOAD_BASE = (
  import.meta.env.VITE_UPLOAD_URL ||
  'https://api2.qurilishcrm.com.uz'
).replace(/\/+$/, '')

// Rasm URL'ini to'g'rilash
const resolveImageUrl = (image) => {
  if (!image) return ''

  let src = image

  try {
    src = getImageUrl(image) || image
  } catch {
    src = image
  }

  try {
    const url = new URL(String(src), `${UPLOAD_BASE}/`)

    // Eski mijoz domenida saqlangan upload URL'lari
    if (
      url.hostname === 'sklad.net.uz' &&
      url.pathname.startsWith('/uploads/')
    ) {
      return `${UPLOAD_BASE}${url.pathname}${url.search}${url.hash}`
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return ''
    }

    return url.href
  } catch {
    return ''
  }
}

// Yuklanmagan rasmni placeholder bilan almashtirish
const handleImageError = (category) => {
  failedImages[category.id] = category.displayImage
}

// Kategoriyalarni qidirish va rasmlarini tayyorlash
const filteredCategories = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  const categories = categoryStore.categories || []

  return categories
    .filter((category) =>
      (category.name || '').toLowerCase().includes(query)
    )
    .map((category) => ({
      ...category,
      displayImage: resolveImageUrl(category.image_url)
    }))
})

// Statistikalar
const totalDebts = computed(() => debtStore.totalDebts)
const totalCredits = computed(() => debtStore.totalCredits)

const todayOrders = computed(() => orderStore.todayOrders || [])
const todayTotal = computed(() => orderStore.todayTotal)

const todayDate = computed(() => {
  return new Date().toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

// Ma'lumotlarni parallel yuklash
const refreshData = async () => {
  loadError.value = ''

  const results = await Promise.allSettled([
    fetchProducts(),
    orderStore.fetchOrders(),
    categoryStore.fetchCategories(),
    debtStore.fetchCustomers()
  ])

  if (results.some((result) => result.status === 'rejected')) {
    loadError.value =
      "Ba'zi ma'lumotlarni yuklab bo'lmadi."
  }
}

// Dastlab bir marta yuklaymiz
onMounted(() => {
  refreshData()
})

// KeepAlive'da birinchi aktivatsiyada takroriy API
// so'rovini yubormaymiz
let firstActivation = true

onActivated(() => {
  if (firstActivation) {
    firstActivation = false
    return
  }

  refreshData()
})

const openCategory = (category) => {
  router.push({
    name: 'CategoryProducts',
    params: { id: category.id }
  })
}

const viewOrder = (order) => {
  router.push(`/orders/${order.id}`)
}

const goToLowStock = () => router.push('/low-stock')
const goToOutOfStock = () => router.push('/out-of-stock')
</script>
