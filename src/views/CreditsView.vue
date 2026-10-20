<template>
    <div class="h-screen flex flex-col bg-[#F8FAF9] dark:bg-gray-950 overflow-hidden font-sans text-slate-900">

        <div
            class="flex-none p-4 bg-white dark:bg-gray-900 border-b border-emerald-100 dark:border-gray-800 z-20 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <button @click="router.back()"
                        class="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-gray-800 text-emerald-600 dark:text-emerald-300 active:scale-90 transition-all border border-emerald-100 dark:border-gray-700">
                        <span class="text-xl font-bold">←</span>
                    </button>
                    <div>
                        <h1 class="text-base font-black tracking-tight dark:text-white leading-none">Bizning Qarzlar
                        </h1>
                        <p class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Omonatlar
                            nazorati</p>
                    </div>
                </div>

                <button @click="ui.showAdd = true"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-lg shadow-emerald-100 dark:shadow-none active:scale-95 transition-all uppercase tracking-tight">
                    + Yangi Haqdor
                </button>
            </div>

            <div class="flex items-center gap-4">
                <div class="relative group flex-1">
                    <input v-model="searchQuery" type="text" placeholder="Haqdor ismini qidirish..."
                        class="w-full pl-11 pr-4 py-3 bg-emerald-50/30 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm border border-emerald-100 dark:border-gray-700 transition-all" />
                    <span
                        class="absolute left-4 top-3 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">🔍</span>
                </div>
            </div>
            <div class="bg-emerald-600 text-white px-4 py-2 rounded-2xl shrink-0 text-left my-2">
                <p class="text-[7px] font-black uppercase opacity-70 leading-none mb-1">Jami:</p>
                <p class="text-xs font-black tracking-tight leading-none">{{
                    formatCurrency(Math.abs(totalCreditSum)) }}</p>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto p-1 space-y-4 custom-scrollbar pb-32">
            <div v-if="debtStore.loading" class="space-y-4">
                <div v-for="i in 5" :key="i"
                    class="h-36 bg-white dark:bg-gray-900 animate-pulse rounded-[2rem] border border-emerald-50"></div>
            </div>

            <div v-else-if="filteredCredits.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="c in filteredCredits" :key="c.id"
                    class="bg-white dark:bg-gray-900 rounded-[2rem] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-gray-800 flex flex-col gap-6 transition-all hover:border-emerald-200">

                    <div class="flex justify-between items-start">
                        <div @click="router.push(`/debts/history/${c.id}`)" class="flex-1 cursor-pointer">
                            <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg leading-tight mb-1">{{
                                c.name }}</h3>
                            <div class="flex items-center gap-1.5 opacity-60">
                                <span class="text-[10px]">📞</span>
                                <span class="text-[11px] font-bold tracking-tight text-slate-500">{{ c.phone ||
                                    'Kiritilmagan' }}</span>
                            </div>
                        </div>
                        <div
                            class="bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg border border-emerald-100">
                            <span class="text-[9px] font-black text-emerald-600 uppercase">Haqdor</span>
                        </div>
                    </div>

                    <div class="flex items-end justify-between pt-4 border-t border-slate-50 dark:border-gray-800">
                        <div>
                            <span
                                class="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase mb-1 tracking-widest block">Haqqi</span>
                            <span
                                class="text-xl font-black tracking-tighter leading-none text-emerald-600 dark:text-emerald-400">
                                {{ formatCurrency(Math.abs(c.balance)) }}
                            </span>
                        </div>

                        <div class="flex items-center gap-2">
                            <button v-if="parseFloat(c.balance) === 0" @click="openDeleteModal(c)"
                                class="w-11 h-11 flex items-center justify-center bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl active:scale-90 border border-red-100 dark:border-red-900/20">
                                <span class="text-lg">🗑️</span>
                            </button>

                            <button @click="openModal(c, 'minus')"
                                class="w-11 h-11 bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-2xl active:scale-90 border border-slate-100">
                                −
                            </button>
                            <button @click="openModal(c, 'plus')"
                                class="w-11 h-11 bg-emerald-600 text-white rounded-2xl font-black text-2xl active:scale-90 shadow-lg shadow-emerald-100">
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else
                class="text-center py-24 opacity-20 font-black uppercase tracking-[0.4em] text-sm dark:text-white">
                Haqdorlar yo'q
            </div>
        </div>

        <Modal :show="ui.show" :title="ui.type === 'plus' ? 'Qarz olish' : 'Qarzni qaytarish'" @close="ui.show = false">
            <div class="p-5 space-y-6">
                <div
                    class="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-gray-800/50 rounded-2xl border border-emerald-100">
                    <div>
                        <p class="text-[10px] font-bold text-emerald-500 uppercase mb-0.5">Haqdor:</p>
                        <p class="text-base font-black text-slate-800 dark:text-white leading-tight">{{
                            ui.customer?.name }}</p>
                    </div>
                    <div
                        class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-lg">
                        👤</div>
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
                    class="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-base active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wider">
                    <span v-if="loading"
                        class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>{{ loading ? 'Saqlanmoqda...' : 'Tasdiqlash' }}</span>
                </button>
            </div>
        </Modal>

        <Modal :show="ui.showAdd" title="YANGI HAQDOR QO'SHISH" @close="closeAddModal">
            <div class="p-4 space-y-5">
                <div class="space-y-1.5">
                    <label class="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">To'liq
                        ism</label>
                    <input v-model="customerForm.name" type="text"
                        :class="['w-full p-4 bg-slate-50 dark:bg-gray-800 rounded-2xl font-bold outline-none border transition-all', errors.name ? 'border-red-500' : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/20']"
                        placeholder="Ali Valiyev">
                    <p v-if="errors.name" class="text-[10px] text-red-500 font-bold ml-1 uppercase">{{ errors.name }}
                    </p>
                </div>
                <div class="space-y-1.5">
                    <label class="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">Telefon</label>
                    <div class="relative flex items-center">
                        <span class="absolute left-4 font-bold text-slate-400 text-sm">+998</span>
                        <input v-model="customerForm.phone" type="tel" maxlength="9"
                            :class="['w-full p-4 pl-14 bg-slate-50 dark:bg-gray-800 rounded-2xl font-bold outline-none border transition-all', errors.phone ? 'border-red-500' : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/20']"
                            placeholder="901234567">
                    </div>
                    <p v-if="errors.phone" class="text-[10px] text-red-500 font-bold ml-1 uppercase">{{ errors.phone }}
                    </p>
                </div>
                <button @click="submitNewCustomer" :disabled="loading"
                    class="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-100 active:scale-[0.97] transition-all flex items-center justify-center gap-2 uppercase">
                    <span v-if="loading"
                        class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Saqlash</span>
                </button>
            </div>
        </Modal>
        <Modal :show="ui.showDelete" title="HAQDORNI O'CHIRISH" @close="ui.showDelete = false">
            <div class="p-6 text-center space-y-6">
                <div
                    class="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto border border-red-100 dark:border-red-800">
                    ⚠️
                </div>

                <div>
                    <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Ishonchingiz
                        komilmi?</h3>
                    <p class="text-sm text-slate-500 mt-2">
                        <span class="font-bold text-red-500">{{ ui.customer?.name }}</span>
                        ro'yxatdan butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.
                    </p>
                </div>

                <div class="flex gap-3">
                    <button @click="ui.showDelete = false"
                        class="flex-1 py-4 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold uppercase text-xs active:scale-95 transition-all">
                        Bekor qilish
                    </button>
                    <button @click="deleteCustomer" :disabled="loading"
                        class="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold uppercase text-xs shadow-lg shadow-red-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span v-if="loading"
                            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        O'chirish
                    </button>
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
const ui = reactive({ show: false, showAdd: false, customer: null, type: '', showDelete: false, });
const form = reactive({ amount: '', description: '' });
const customerForm = reactive({ name: '', phone: '' });
const errors = reactive({ name: '', phone: '' });

onMounted(() => debtStore.fetchCustomers());
const openDeleteModal = (customer) => {
    ui.customer = customer;
    ui.showDelete = true;
};

const deleteCustomer = async () => {
    loading.value = true;
    try {
        await debtStore.removeCustomer(ui.customer.id);
        await debtStore.fetchCustomers();
        ui.showDelete = false;
    } finally { loading.value = false; }
};
const closeAddModal = () => {
    ui.showAdd = false;
    customerForm.name = '';
    customerForm.phone = '';
    errors.name = '';
    errors.phone = '';
};

const submitNewCustomer = async () => {
    errors.name = '';
    errors.phone = '';
    let isValid = true;

    if (!customerForm.name.trim()) {
        errors.name = "Ism shart!";
        isValid = false;
    }
    if (customerForm.phone && !/^[0-9]{9}$/.test(customerForm.phone)) {
        errors.phone = "Xato raqam!";
        isValid = false;
    }

    if (!isValid || loading.value) return;
    loading.value = true;

    try {
        await debtStore.addCustomer({
            name: customerForm.name.trim(),
            phone: customerForm.phone ? '+998' + customerForm.phone : '',
            type: 'creditor'
        });

        await debtStore.fetchCustomers();
        closeAddModal();
    } catch (err) {
        console.error("Xatolik:", err);
    } finally {
        loading.value = false;
    }
};

const filteredCredits = computed(() => {
    if (!debtStore.customers) return [];
    const q = searchQuery.value.toLowerCase().trim();

    return debtStore.customers.filter(c => {
        const isCreditor = c.type === 'creditor';

        const matchesSearch = c.name.toLowerCase().includes(q) ||
            (c.phone && c.phone.includes(q));

        return isCreditor && matchesSearch;
    });
});

const totalCreditSum = computed(() => filteredCredits.value.reduce((sum, c) => sum + parseFloat(c.balance), 0));

const openModal = (customer, type) => {
    ui.customer = customer;
    ui.type = type;
    form.amount = '';
    form.description = '';
    ui.show = true;
};

const submit = async () => {
    if (!form.amount || loading.value) return;
    loading.value = true;
    try {
        const finalType = ui.type === 'plus' ? 'minus' : 'plus';
        const defaultDesc = ui.type === 'plus' ? 'Omonat olindi' : 'Qaytarildi';

        await debtStore.modifyBalance(ui.customer.id, {
            amount: parseFloat(form.amount),
            type: finalType,
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
    background: rgba(16, 185, 129, 0.1);
    border-radius: 10px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>