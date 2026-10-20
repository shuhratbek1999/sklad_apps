<template>
    <div class="h-[100dvh] overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div class="p-4 lg:p-6 max-w-2xl mx-auto h-full flex flex-col animate-fade-in">

            <!-- Header -->
            <div class="flex items-center gap-4 mb-5 shrink-0">
                <button @click="$router.back()"
                    class="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
                    ⬅️
                </button>

                <div class="min-w-0">
                    <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white truncate">
                        {{ customer?.name || 'Mijoz' }}
                    </h2>
                    <p class="text-xs text-gray-500 truncate">Tranzaksiyalar tarixi</p>
                </div>
            </div>

            <!-- Balance Card -->
            <div
                class="bg-indigo-600 p-5 sm:p-6 rounded-[2rem] shadow-xl shadow-indigo-100 mb-5 text-white relative overflow-hidden shrink-0">
                <div class="relative z-10">
                    <p class="text-indigo-100 text-[11px] sm:text-xs font-medium uppercase tracking-wider mb-1">
                        Hozirgi Balans
                    </p>
                    <h3 class="text-2xl sm:text-3xl font-black break-words">
                        {{ formatCurrency(customer?.balance || 0) }}
                    </h3>
                </div>
                <div class="absolute -right-6 -bottom-6 text-7xl sm:text-8xl opacity-10 rotate-12">💳</div>
            </div>

            <!-- Section title -->
            <div class="mb-3 shrink-0">
                <h4 class="text-sm font-bold text-gray-400 uppercase ml-1">
                    Amallar ro'yxati
                </h4>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="flex-1 overflow-y-auto pr-1 custom-scroll pb-24">
                <div class="space-y-3">
                    <div v-for="i in 5" :key="i" class="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl">
                    </div>
                </div>
            </div>

            <!-- Empty -->
            <div v-else-if="transactions.length === 0"
                class="flex-1 overflow-y-auto pr-1 custom-scroll pb-24 flex items-center justify-center">
                <div class="text-center py-10 opacity-50">
                    <p>Hozircha amallar mavjud emas</p>
                </div>
            </div>

            <!-- Transactions list -->
            <div v-else class="flex-1 overflow-y-auto pr-1 custom-scroll pb-24">
                <div class="space-y-3">
                    <div v-for="item in transactions" :key="item.id"
                        class="bg-white dark:bg-gray-800 p-3.5 sm:p-4 rounded-2xl border border-gray-50 dark:border-gray-700 shadow-sm flex items-center justify-between gap-3">

                        <div class="flex items-center gap-3 min-w-0 flex-1">
                            <div :class="[
                                'w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-inner shrink-0',
                                item.type === 'plus'
                                    ? 'bg-red-50 text-red-500'
                                    : 'bg-emerald-50 text-emerald-500'
                            ]">
                                {{ item.type === 'plus' ? '📉' : '📈' }}
                            </div>

                            <div class="min-w-0 flex-1">
                                <p class="font-bold text-sm sm:text-base text-gray-900 dark:text-white break-words">
                                    {{
                                        item.description || (item.type === 'plus'
                                            ? 'Qarz oldi'
                                            : 'To\'lov qildi')
                                    }}
                                </p>
                                <p class="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                                    {{ formatTime(item.createdAt) }}
                                </p>
                            </div>
                        </div>

                        <div class="text-right shrink-0">
                            <p :class="[
                                'font-black text-sm sm:text-lg',
                                item.type === 'plus' ? 'text-red-500' : 'text-emerald-500'
                            ]">
                                {{ item.type === 'plus' ? '+' : '-' }} {{ formatCurrency(item.amount) }}
                            </p>
                            <span class="text-[10px] text-gray-400">
                                Amal №{{ item.id }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDebtStore } from '@/stores/debtStore'
import { formatCurrency, formatTime } from '@/utils/formatters'

const route = useRoute()
const debtStore = useDebtStore()

const customer = ref(null)
const transactions = ref([])
const loading = ref(true)

onMounted(async () => {
    try {
        const customerId = route.params.id

        if (debtStore.customers.length === 0) {
            await debtStore.fetchCustomers()
        }

        customer.value = debtStore.customers.find(c => c.id == customerId) || null
        transactions.value = await debtStore.fetchCustomerTransactions(customerId)
    } catch (error) {
        console.error('Tranzaksiyalarni yuklashda xatolik:', error)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
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
    background: rgba(99, 102, 241, 0.35);
    border-radius: 9999px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.55);
}
</style>