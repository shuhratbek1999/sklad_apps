<template>
    <div class="h-screen flex flex-col bg-[#F9FAFB] dark:bg-gray-950 overflow-hidden font-sans text-slate-900">

        <div
            class="flex-none p-4 bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-gray-800 z-20 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <button @click="router.back()"
                        class="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all border border-slate-100 dark:border-gray-700">
                        <span class="text-xl font-bold">←</span>
                    </button>
                    <div>
                        <h1 class="text-base font-black tracking-tight dark:text-white leading-none">Mijozlar Qarzi</h1>
                        <p class="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-1">Nasiya nazorati</p>
                    </div>
                </div>
                <button @click="ui.showAdd = true"
                    class="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-lg shadow-red-100 dark:shadow-none active:scale-95 transition-all uppercase tracking-tight">
                    + Yangi Mijoz
                </button>
            </div>

            <div class="relative group">
                <input v-model="searchQuery" type="text" placeholder="Ism yoki telefon orqali qidirish..."
                    class="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/20 text-sm border border-slate-200 dark:border-gray-700 transition-all shadow-inner" />
                <span
                    class="absolute left-4 top-4 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">🔍</span>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto p-1 space-y-4 custom-scrollbar pb-32">

            <div v-if="debtStore.loading" class="space-y-4">
                <div v-for="i in 5" :key="i"
                    class="h-32 bg-white dark:bg-gray-900 animate-pulse rounded-[2rem] border border-slate-100 dark:border-gray-800">
                </div>
            </div>

            <div v-else-if="filteredDebts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="c in filteredDebts" :key="c.id"
                    class="bg-white dark:bg-gray-900 rounded-[2rem] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-gray-800 flex flex-col gap-6 transition-all hover:border-red-100 dark:hover:border-red-900/30">

                    <div class="flex justify-between items-start">
                        <div @click="router.push(`/debts/history/${c.id}`)" class="flex-1 cursor-pointer">
                            <h3
                                class="font-black text-slate-800 dark:text-slate-100 text-lg leading-tight mb-1 group-hover:text-red-600">
                                {{ c.name }}</h3>
                            <div class="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                <span class="text-xs">📞</span>
                                <span class="text-[12px] font-bold tracking-tight">{{ c.phone || 'Tel: kiritilmagan'
                                }}</span>
                            </div>
                        </div>
                        <div
                            class="bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-xl border border-red-100 dark:border-red-900/50">
                            <span
                                class="text-[9px] font-black text-red-600 dark:text-red-400 uppercase tracking-tighter">Mijoz</span>
                        </div>
                    </div>

                    <div class="flex items-end justify-between pt-4 border-t border-slate-50 dark:border-gray-800">
                        <div>
                            <p
                                class="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase mb-1 tracking-widest">
                                Balans</p>
                            <p
                                :class="['text-xl font-black tracking-tighter leading-none', parseFloat(c.balance) === 0 ? 'text-slate-200 dark:text-gray-800' : 'text-red-500']">
                                {{ formatCurrency(Math.abs(c.balance)) }}
                            </p>
                        </div>

                        <div class="flex items-center gap-2">
                            <button v-if="parseFloat(c.balance) === 0" @click="confirmDelete(c)"
                                class="w-11 h-11 flex items-center justify-center bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl active:scale-90 transition-all border border-red-100 dark:border-red-900/30">
                                <span class="text-xl">🗑️</span>
                            </button>

                            <button @click="openModal(c, 'minus')"
                                class="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-2xl active:scale-90 transition-all border border-slate-100 dark:border-gray-700">
                                −
                            </button>

                            <button @click="openModal(c, 'plus')"
                                class="w-11 h-11 flex items-center justify-center bg-red-600 text-white rounded-2xl font-black text-2xl active:scale-90 transition-all shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-700">
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else
                class="text-center py-24 opacity-20 font-black uppercase tracking-[0.4em] text-sm dark:text-white">
                Ro'yxat bo'sh</div>
        </div>

        <Modal :show="ui.show" :title="ui.type === 'plus' ? 'Nasiya berish' : 'To\'lov qabul qilish'"
            @close="ui.show = false">
            <div class="p-5 space-y-6">
                <div
                    class="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                    <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Mijoz:</p>
                        <p class="text-base font-black text-slate-800 dark:text-white leading-tight">{{
                            ui.customer?.name }}</p>
                    </div>
                    <div
                        class="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-lg">
                        👤
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between px-1"><label
                            class="text-[11px] font-bold text-slate-400 uppercase">Summa</label></div>
                    <input v-model="form.amount" type="number" autofocus
                        class="w-full px-4 py-4 bg-slate-50 dark:bg-gray-800 rounded-2xl text-2xl font-black text-center outline-none border-2 border-transparent focus:border-emerald-500 text-emerald-600 shadow-inner"
                        placeholder="0">
                    <div class="flex justify-between px-1">
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Izoh
                            (ixtiyoriy)</label>
                    </div>
                    <textarea v-model="form.description" rows="2"
                        class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 rounded-2xl text-sm font-medium outline-none border-2 border-transparent focus:border-emerald-500 transition-all resize-none"
                        placeholder="Masalan: Naqd pul orqali yoki karta orqali..."></textarea>
                </div>

                <button @click="submit" :disabled="!form.amount || loading"
                    class="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:dark:bg-gray-800 text-white rounded-2xl font-bold text-base shadow-lg shadow-red-100 dark:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <span v-if="loading"
                        class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span class="uppercase tracking-wider">{{ loading ? 'Saqlanmoqda...' : 'Tasdiqlash' }}</span>
                </button>
            </div>
        </Modal>

        <Modal :show="ui.showAdd" title="YANGI MIJOZ QO'SHISH" @close="closeAddModal">
            <div class="p-4 space-y-5">
                <div class="space-y-1.5">
                    <label class="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">To'liq
                        ism</label>
                    <input v-model="customerForm.name" type="text" :class="[
                        'w-full p-4 bg-slate-50 dark:bg-gray-800 rounded-2xl font-bold outline-none border transition-all',
                        errors.name ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500/20'
                    ]" placeholder="Masalan: Ali Valiyev">
                    <p v-if="errors.name" class="text-[10px] text-red-500 font-bold ml-1 uppercase">{{ errors.name }}
                    </p>
                </div>

                <div class="space-y-1.5">
                    <label class="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">Telefon (9 ta
                        raqam)</label>
                    <div class="relative flex items-center">
                        <span class="absolute left-4 font-bold text-slate-400 text-sm">+998</span>
                        <input v-model="customerForm.phone" type="tel" maxlength="9" :class="[
                            'w-full p-4 pl-14 bg-slate-50 dark:bg-gray-800 rounded-2xl font-bold outline-none border transition-all',
                            errors.phone ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500/20'
                        ]" placeholder="901234567">
                    </div>
                    <p v-if="errors.phone" class="text-[10px] text-red-500 font-bold ml-1 uppercase">{{ errors.phone }}
                    </p>
                </div>

                <button @click="submitNewCustomer" :disabled="loading"
                    class="w-full py-4 bg-slate-900 dark:bg-red-600 text-white rounded-2xl font-black text-base active:scale-[0.97] transition-all shadow-xl shadow-slate-200 dark:shadow-none flex items-center justify-center gap-2">
                    <span v-if="loading"
                        class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>{{ loading ? 'SAQLANMOQDA...' : 'MIJOZNI SAQLASH' }}</span>
                </button>
            </div>
        </Modal>

        <Modal :show="ui.showDelete" title="Mijozni o'chirish" @close="ui.showDelete = false">
            <div class="p-6 text-center space-y-8">
                <div
                    class="w-24 h-24 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                    🗑️</div>
                <div>
                    <h4 class="text-lg font-black text-slate-900 dark:text-white mb-2 italic">Ishonchingiz komilmi?</h4>
                    <p class="text-sm text-slate-500 dark:text-slate-400"><span class="font-bold text-red-500">{{
                        ui.customer?.name }}</span> barcha nasiya tarixlari bilan birga o'chib ketadi.</p>
                </div>
                <div class="flex gap-4">
                    <button @click="ui.showDelete = false"
                        class="flex-1 py-4 bg-slate-100 dark:bg-gray-800 rounded-2xl font-bold text-slate-500">BEKOR</button>
                    <button @click="deleteCustomer"
                        class="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200">O'CHIRILSIN</button>
                </div>
            </div>
        </Modal>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useDebtStore } from '@/stores/debtStore';
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'vue-router';
import Modal from '@/components/ui/Modal.vue';

const debtStore = useDebtStore();
const router = useRouter();
const searchQuery = ref('');
const loading = ref(false);
const errors = reactive({
    name: '',
    phone: ''
});
const ui = reactive({
    show: false,
    showAdd: false,
    showDelete: false,
    customer: null,
    type: ''
});

const form = reactive({ amount: '', description: '' });
const customerForm = reactive({ name: '', phone: '' });

onMounted(() => debtStore.fetchCustomers());

const filteredDebts = computed(() => {
    if (!debtStore.customers) return [];
    const q = searchQuery.value.toLowerCase().trim();
    return debtStore.customers.filter(c => {
        const isCustomer = c.type === 'customer';
        const matchesSearch = c.name.toLowerCase().includes(q) ||
            (c.phone && c.phone.includes(q));
        return isCustomer && matchesSearch;
    });
});
const closeAddModal = () => {
    ui.showAdd = false;
    customerForm.name = '';
    customerForm.phone = '';
    errors.name = '';
    errors.phone = '';
};
const openModal = (customer, type) => {
    ui.customer = customer;
    ui.type = type;
    form.amount = '';
    form.description = '';
    ui.show = true;
};

const confirmDelete = (customer) => {
    ui.customer = customer;
    ui.showDelete = true;
};

const submitNewCustomer = async () => {
    // 1. Xatolarni tozalash
    errors.name = '';
    errors.phone = '';

    let isValid = true;

    // 2. Ism tekshiruvi
    if (!customerForm.name.trim()) {
        errors.name = "Ism kiritish shart!";
        isValid = false;
    } else if (customerForm.name.trim().length < 3) {
        errors.name = "Ism juda qisqa (min. 3 ta harf)!";
        isValid = false;
    }

    // 3. Telefon tekshiruvi
    const phoneRegex = /^[0-9]{9}$/;
    if (!customerForm.phone) {
        errors.phone = "Telefon raqam shart!";
        isValid = false;
    } else if (!phoneRegex.test(customerForm.phone)) {
        errors.phone = "Faqat 9 ta raqam kiriting (masalan: 901234567)!";
        isValid = false;
    }

    if (!isValid || loading.value) return;

    loading.value = true;
    try {
        const formattedData = {
            name: customerForm.name.trim(),
            phone: '+998' + customerForm.phone,
            type: 'customer'
        };

        await debtStore.addCustomer(formattedData);
        await debtStore.fetchCustomers();
        closeAddModal();
    } catch (err) {
        console.error(err);
        alert("Xatolik yuz berdi. Ism takrorlanmaganiga ishonch hosil qiling.");
    } finally {
        loading.value = false;
    }
};
const deleteCustomer = async () => {
    loading.value = true;
    try {
        await debtStore.removeCustomer(ui.customer.id);
        await debtStore.fetchCustomers();
        ui.showDelete = false;
    } finally { loading.value = false; }
};

const submit = async () => {
    if (!form.amount || loading.value) return;
    loading.value = true;
    let defaultDesc = ui.type === 'plus' ? 'Nasiya berildi' : 'To\'lov yopildi'
    try {
        await debtStore.modifyBalance(ui.customer.id, {
            amount: parseFloat(form.amount),
            type: ui.type,
            description: form.description.trim() || defaultDesc
        });
        await debtStore.fetchCustomers();
        ui.show = false;
    } finally { loading.value = false; }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(220, 38, 38, 0.08);
    border-radius: 10px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>