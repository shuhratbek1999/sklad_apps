<template>
  <div class="animate-fade-in p-2 lg:p-6 space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatsCard title="Jami Maxsulotlar" @click="router.push('/')" :value="totalProducts" icon="📦" color="primary"
        :loading="loading" />
      <StatsCard title="Umumiy Qiymat" @click="router.push('/')" :value="formatCurrency(totalValue)" icon="💰"
        color="success" :loading="loading" />
      <StatsCard title="Kam Zaxira" @click="goToLowStock" :value="lowStockCount" icon="⚠️" color="warning"
        :loading="loading" />
      <StatsCard title="Tugaganlar" @click="goToOutOfStock" :value="outOfStockCount" icon="⛔" color="danger"
        :loading="loading" />

      <StatsCard title="Mijozlar Qarzi" @click="router.push('/debts')" :value="formatCurrency(totalDebts)" icon="📉"
        color="danger" :loading="debtStore.loading" />
      <StatsCard title="Bizning qarzimiz" @click="router.push('/credits')" :value="formatCurrency(totalCredits)"
        icon="📈" color="info" :loading="debtStore.loading" />
    </div>

    <Card class="overflow-hidden border-l-4 border-l-green-500">
      <div class="md:p-4 max-sm:p-1">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <span class="text-green-600 text-xl">📋</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Bugungi buyurtmalar</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ todayDate }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-base font-bold text-green-600">{{ formatCurrency(todayTotal) }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ todayOrders.length }} ta buyurtma</p>
          </div>
        </div>

        <div v-if="todayOrders.length === 0" class="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <span class="text-4xl mb-2 block">📭</span>
          <p class="text-sm text-gray-600 dark:text-gray-400">Bugun buyurtmalar yo'q</p>
        </div>

        <div v-else class="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="order in todayOrders" :key="order.id" @click="viewOrder(order)"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer transition-all border border-transparent hover:border-green-200">
            <div class="flex items-center gap-3">
              <span
                class="text-[10px] font-medium text-gray-500 dark:text-gray-400 min-w-[40px] bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded shadow-sm">
                {{ formatTime(order.createdAt) }}
              </span>
              <div>
                <p class="font-medium text-sm text-gray-900 dark:text-white">
                  {{ order.items?.[0]?.product?.name || 'Buyurtma' }}
                  <span v-if="order.items?.length > 1"
                    class="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full ml-1">
                    +{{ order.items.length - 1 }}
                  </span>
                </p>
              </div>
            </div>
            <div class="text-right font-bold text-sm text-green-600 dark:text-green-400">
              {{ formatCurrency(order.total_amount) }}
            </div>
          </div>
        </div>
      </div>
    </Card>

    <div class="space-y-4">
      <div class="relative group">
        <span
          class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
          🔍
        </span>
        <input v-model="searchQuery" type="text" placeholder="Kategoriyalarni qidirish..."
          class="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
      </div>

      <div v-if="categoryStore.loading" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="i in 4" :key="i" class="h-20 bg-gray-100 animate-pulse rounded-2xl"></div>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <div v-for="category in filteredCategories" :key="category.id"
          @click="router.push({ name: 'CategoryProducts', params: { id: category.id } })"
          class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden active:scale-95 transition-all duration-150 cursor-pointer relative">
          <div
            class="absolute top-2 right-2 z-10 bg-gray-300 text-black text-[10px] font-bold px-1.5 py-1.5 rounded-full shadow-md min-w-[20px] text-center border-2 border-white dark:border-gray-800">
            {{ category.products?.length }}
          </div>
          <div class="aspect-square bg-gray-50 dark:bg-gray-900 min-h-60 overflow-hidden">
            <img :src="getImageUrl(category.image_url)" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="p-2 text-center">
            <h3 class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm truncate leading-tight">
              {{ category.name }}
            </h3>
          </div>
        </div>
      </div>

      <div v-if="filteredCategories.length === 0 && !categoryStore.loading" class="text-center py-10">
        <p class="text-gray-500 italic">Bunday kategoriya topilmadi...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onActivated, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductWithStats } from '@/composables/useProductWithStats'
import { useOrderStore } from '@/stores/orderStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useDebtStore } from '@/stores/debtStore' // Debt Store qo'shildi
import { formatCurrency, formatTime } from '@/utils/formatters'
import { useImageUpload } from '@/composables/useImageUpload'
import Card from '@/components/ui/Card.vue'
import StatsCard from '@/components/products/StatsCard.vue'

const { getImageUrl } = useImageUpload()
const router = useRouter()
const orderStore = useOrderStore()
const categoryStore = useCategoryStore()
const debtStore = useDebtStore() // Initialization

const searchQuery = ref('')
const {
  loading,
  totalProducts,
  totalValue,
  lowStockCount,
  outOfStockCount,
  fetchProducts
} = useProductWithStats()

// Debt Stats computed qiymatlari
const totalDebts = computed(() => debtStore.totalDebts)
const totalCredits = computed(() => debtStore.totalCredits)

const todayOrders = computed(() => orderStore.todayOrders)
const todayTotal = computed(() => orderStore.todayTotal)

const todayDate = computed(() => {
  return new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
})

const filteredCategories = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return categoryStore.categories
  return categoryStore.categories.filter(category =>
    category.name.toLowerCase().includes(query)
  )
})

const refreshData = async () => {
  await Promise.all([
    fetchProducts(),
    orderStore.fetchOrders(),
    categoryStore.fetchCategories(),
    debtStore.fetchCustomers() // Qarz ma'lumotlarini yangilash
  ])
}

onMounted(refreshData)
onActivated(refreshData)

const viewOrder = (order) => router.push(`/orders/${order.id}`)
const goToLowStock = () => router.push('/low-stock')
const goToOutOfStock = () => router.push('/out-of-stock')
</script>