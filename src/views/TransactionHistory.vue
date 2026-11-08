<template>
    <div class="animate-fade-in px-2 py-3 sm:p-4 lg:p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Kirim-chiqim tarixi</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Ombordagi barcha mahsulot harakatlari</p>
            </div>
            <button type="button" @click="reload" :disabled="loading"
                class="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">Yangilash</button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">Jami kirim</p>
                <p class="text-2xl font-bold text-green-600 mt-1">+{{ number(stats?.incoming?.total_quantity) }} <span
                        class="text-sm font-normal">dona</span></p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ currency(stats?.incoming?.total_amount) }}
                </p>
            </div>
            <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">Jami chiqim</p>
                <p class="text-2xl font-bold text-red-600 mt-1">−{{ number(stats?.outgoing?.total_quantity) }} <span
                        class="text-sm font-normal">dona</span></p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ currency(stats?.outgoing?.total_amount) }}
                </p>
            </div>
            <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">Jami operatsiyalar</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ number(stats?.total_transactions) }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Tanlangan filtrlar bo‘yicha</p>
            </div>
        </div>

        <section
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <label class="block"><span
                        class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Harakat turi</span>
                    <select v-model="filters.type" class="field">
                        <option value="">Barchasi</option>
                        <option value="add">Kirim</option>
                        <option value="sell">Chiqim</option>
                    </select>
                </label>
                <label class="block"><span
                        class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Mahsulot</span>
                    <select v-model="filters.product_id" class="field">
                        <option value="">Barcha mahsulotlar</option>
                        <option v-for="p in products" :key="p.id" :value="String(p.id)">{{ p.name }}</option>
                    </select>
                </label>
                <label class="block"><span
                        class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Boshlanish
                        sanasi</span><input v-model="filters.start_date" type="date" class="field" /></label>
                <label class="block"><span
                        class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Tugash
                        sanasi</span><input v-model="filters.end_date" type="date" class="field" /></label>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3">
                <p class="text-xs text-gray-500 dark:text-gray-400">Sana kiritilmasa, barcha davr ko‘rsatiladi.</p>
                <div class="flex gap-2">
                    <button type="button" @click="resetFilters"
                        class="px-4 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">Tozalash</button>
                    <button type="button" @click="applyFilters" :disabled="loading"
                        class="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50">Ko‘rsatish</button>
                </div>
            </div>
        </section>

        <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ error }}
            <button type="button" @click="reload" class="font-semibold underline ml-2">Qayta urinish</button></div>

        <section
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div
                class="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 class="font-semibold text-gray-900 dark:text-white">Harakatlar ro‘yxati</h2>
                <span class="text-xs text-gray-500 dark:text-gray-400">Jami {{ number(pagination?.total ?? 0) }}
                    ta</span>
            </div>
            <div v-if="loading" class="p-5 space-y-3">
                <div v-for="i in 5" :key="i" class="h-14 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
            <div v-else-if="!transactions.length" class="text-center py-14 text-gray-500 dark:text-gray-400"><span
                    class="text-4xl block mb-3">📭</span>Bu filtrlar bo‘yicha harakat topilmadi</div>
            <template v-else>
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-50 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th class="px-4 py-3">Sana</th>
                                <th class="px-4 py-3">Mahsulot</th>
                                <th class="px-4 py-3">Turi</th>
                                <th class="px-4 py-3 text-right">Miqdor</th>
                                <th class="px-4 py-3 text-right">Birlik narxi</th>
                                <th class="px-4 py-3 text-right">Jami summa</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr v-for="item in transactions" :key="item.id" class="text-gray-800 dark:text-gray-200">
                                <td class="px-4 py-3 whitespace-nowrap">{{ dateTime(item.transaction_date) }}</td>
                                <td class="px-4 py-3 font-medium">{{ item.product?.name || `Mahsulot
                                    #${item.product_id}` }}</td>
                                <td class="px-4 py-3"><span :class="badgeClass(item.type)"
                                        class="px-2 py-1 rounded-full text-xs font-semibold">{{ item.type === 'add' ?
                                        'Kirim' : 'Chiqim' }}</span></td>
                                <td class="px-4 py-3 text-right font-bold"
                                    :class="item.type === 'add' ? 'text-green-600' : 'text-red-600'">{{ item.type ===
                                    'add' ? '+' : '−' }}{{ number(item.quantity) }}</td>
                                <td class="px-4 py-3 text-right whitespace-nowrap">{{ currency(item.price) }}</td>
                                <td class="px-4 py-3 text-right whitespace-nowrap font-semibold">{{
                                    currency(Number(item.quantity) * Number(item.price)) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                    <div v-for="item in transactions" :key="item.id"
                        class="p-3 sm:p-4 flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p class="text-sm font-semibold text-gray-900 dark:text-white break-words">{{
                                item.product?.name || `Mahsulot #${item.product_id}` }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ dateTime(item.transaction_date)
                                }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ currency(item.price) }} / dona
                            </p>
                        </div>
                        <div class="text-right shrink-0"><span :class="badgeClass(item.type)"
                                class="inline-block px-2 py-1 rounded-full text-xs font-semibold">{{ item.type === 'add'
                                ? 'Kirim' : 'Chiqim' }}</span>
                            <p class="font-bold mt-2" :class="item.type === 'add' ? 'text-green-600' : 'text-red-600'">
                                {{ item.type === 'add' ? '+' : '−' }}{{ number(item.quantity) }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ currency(Number(item.quantity) *
                                Number(item.price)) }}</p>
                        </div>
                    </div>
                </div>
            </template>
            <div
                class="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-gray-100 dark:border-gray-700">
                <label class="text-xs text-gray-500 dark:text-gray-400">Sahifada <select v-model.number="pageSize"
                        @change="changePageSize"
                        class="ml-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-1 text-gray-900 dark:text-white">
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                    </select></label>
                <div class="flex items-center gap-3"><button type="button" @click="goPage(page - 1)"
                        :disabled="loading || page <= 1"
                        class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 text-sm dark:text-white">Oldingi</button><span
                        class="text-xs text-gray-600 dark:text-gray-300">{{ page }} / {{ Math.max(1, pagination?.pages
                        || 1)
                        }}</span><button type="button" @click="goPage(page + 1)"
                        :disabled="loading || !pagination?.hasNextPage"
                        class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 text-sm dark:text-white">Keyingi</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { onMounted, onActivated, reactive, ref } from 'vue'
import transactionService from '@/services/transactionService'
import api from '@/services/api'
import { formatCurrency } from '@/utils/formatters'

const filters = reactive({ type: '', product_id: '', start_date: '', end_date: '' })
const applied = ref({})
const products = ref([])
const page = ref(1)
const pageSize = ref(20)
const error = ref('')
const loading = ref(false)
const stats = ref(null)
const transactions = ref([])
const pagination = ref(null)
let requestId = 0

const number = value => Number(value || 0).toLocaleString('uz-UZ')
const currency = value => formatCurrency(Number(value || 0))
const badgeClass = type => type === 'add'
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
const dateTime = value => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat('uz-UZ', { timeZone: 'Asia/Tashkent', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

async function loadProducts() {
    try {
        // Product endpointdagi javob formatlari bilan moslash
        const response = await api.get('/products')
        const payload = response?.data ?? response
        const list = Array.isArray(payload) ? payload : (payload?.products ?? [])
        products.value = Array.isArray(list) ? list : []
    } catch (err) {
        console.warn('Mahsulot filtri yuklanmadi:', err)
    }
}

async function reload() {
    const currentId = ++requestId
    loading.value = true
    error.value = ''
    try {
        const params = { ...applied.value, page: page.value, limit: pageSize.value }
        const [listResult, statsResult] = await Promise.allSettled([
            transactionService.getAll(params),
            transactionService.getStats(applied.value)
        ])
        if (currentId !== requestId) return
        if (listResult.status === 'fulfilled') {
            transactions.value = Array.isArray(listResult.value?.data) ? listResult.value.data : []
            pagination.value = listResult.value?.pagination ?? null
        } else {
            transactions.value = []
            pagination.value = null
            error.value = listResult.reason?.message || 'Tarixni yuklab bo‘lmadi'
        }
        if (statsResult.status === 'fulfilled') stats.value = statsResult.value?.data ?? null
        else {
            stats.value = null
            error.value = [error.value, statsResult.reason?.message || 'Statistika yuklanmadi'].filter(Boolean).join('. ')
        }
    } finally {
        if (currentId === requestId) loading.value = false
    }
}

function applyFilters() {
    if (filters.start_date && filters.end_date && filters.start_date > filters.end_date) {
        error.value = 'Boshlanish sanasi tugash sanasidan katta bo‘lishi mumkin emas'
        return
    }
    applied.value = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''))
    page.value = 1
    reload()
}
function resetFilters() {
    Object.keys(filters).forEach(key => { filters[key] = '' })
    applyFilters()
}
function goPage(value) {
    if (value < 1 || value > Math.max(1, pagination.value?.pages || 1)) return
    page.value = value
    reload()
}
function changePageSize() { page.value = 1; reload() }

onMounted(() => { loadProducts(); reload() })
let firstActivation = true
onActivated(() => {
    if (firstActivation) { firstActivation = false; return }
    reload()
})
</script>

<style scoped>
.field {
    @apply w-full min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500;
}
</style>
