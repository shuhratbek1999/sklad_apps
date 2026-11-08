<template>
    <Card class="overflow-hidden border-l-4 border-l-blue-500">
        <div class="p-3 sm:p-4">
            <div class="flex items-center justify-between gap-3 mb-4">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 shrink-0 bg-blue-100
                   dark:bg-blue-900/30 rounded-xl
                   flex items-center justify-center">
                        <span class="text-xl">📊</span>
                    </div>

                    <div class="min-w-0">
                        <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
                            Kirim-chiqim tarixi
                        </h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            Oxirgi 5 ta harakat
                        </p>
                    </div>
                </div>

                <button type="button" class="text-xs sm:text-sm font-semibold text-blue-600
                 dark:text-blue-400 hover:underline shrink-0" @click="router.push('/transactions')">
                    Barchasi →
                </button>
            </div>

            <!-- Bugungi statistika -->
            <div class="grid grid-cols-2 gap-2 mb-4">
                <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p class="text-xs text-green-700 dark:text-green-400">
                        ↓ Bugungi kirim
                    </p>
                    <p class="text-lg font-bold text-green-700 dark:text-green-400">
                        {{ todayIncoming.toLocaleString('uz-UZ') }}
                        <span class="text-xs font-normal">dona</span>
                    </p>
                </div>

                <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <p class="text-xs text-red-700 dark:text-red-400">
                        ↑ Bugungi chiqim
                    </p>
                    <p class="text-lg font-bold text-red-700 dark:text-red-400">
                        {{ todayOutgoing.toLocaleString('uz-UZ') }}
                        <span class="text-xs font-normal">dona</span>
                    </p>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="store.recentLoading" class="space-y-2">
                <div v-for="i in 3" :key="i" class="h-14 rounded-xl bg-gray-100
                 dark:bg-gray-800 animate-pulse" />
            </div>

            <!-- Xatolik -->
            <div v-else-if="loadError" class="text-center py-5 text-sm text-red-600">
                <p>{{ loadError }}</p>
                <button type="button" class="mt-2 font-semibold underline" @click="loadRecent">
                    Qayta urinish
                </button>
            </div>

            <!-- Empty -->
            <div v-else-if="!store.recentTransactions.length" class="text-center py-7 text-gray-500 dark:text-gray-400">
                <span class="text-3xl block mb-2">📭</span>
                <p class="text-sm">Hozircha kirim-chiqim mavjud emas</p>
            </div>

            <!-- Transactions -->
            <div v-else class="space-y-2">
                <div v-for="item in store.recentTransactions" :key="item.id" class="flex items-center justify-between gap-3
                 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-9 h-9 shrink-0 rounded-lg
                     flex items-center justify-center" :class="item.type === 'add'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'">
                            <span v-if="item.type === 'add'">📥</span>
                            <span v-else>📤</span>
                        </div>

                        <div class="min-w-0">
                            <p class="text-sm font-medium text-gray-900
                       dark:text-white truncate">
                                {{ item.product?.name || 'Noma’lum mahsulot' }}
                            </p>

                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                {{ item.type === 'add' ? 'Kirim' : 'Chiqim' }}
                                · {{ formatDate(item.transaction_date) }}
                            </p>
                        </div>
                    </div>

                    <div class="text-right shrink-0">
                        <p class="text-sm font-bold" :class="item.type === 'add'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'">
                            {{ item.type === 'add' ? '+' : '−' }}{{ item.quantity }}
                        </p>

                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{ formatCurrency(Number(item.price) * Number(item.quantity)) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import Card from '@/components/ui/Card.vue'
import { formatCurrency } from '@/utils/formatters'
import { useTransactionStore } from '@/stores/transactionStore'
import transactionService from '@/services/transactionService'
const router = useRouter()
const store = useTransactionStore()

const loadError = ref('')
const todayStats = ref(null)

const today = () => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Tashkent',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(new Date())

    const get = (type) => parts.find(p => p.type === type)?.value
    return `${get('year')}-${get('month')}-${get('day')}`
}

const todayIncoming = computed(() =>
    Number(todayStats.value?.incoming?.total_quantity || 0)
)

const todayOutgoing = computed(() =>
    Number(todayStats.value?.outgoing?.total_quantity || 0)
)

const formatDate = (value) => {
    if (!value) return '—'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'

    return new Intl.DateTimeFormat('uz-UZ', {
        timeZone: 'Asia/Tashkent',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
}

const loadRecent = async () => {
    loadError.value = ''

    try {
        const date = today()

        const [, statsResponse] = await Promise.all([
            store.fetchRecentTransactions(),
            transactionService.getStats({
                start_date: date,
                end_date: date
            })
        ])

        todayStats.value = statsResponse?.data ?? null
    } catch (err) {
        loadError.value = err.message || 'Ma’lumotlarni yuklab bo‘lmadi'
    }
}

onMounted(loadRecent)
</script>
