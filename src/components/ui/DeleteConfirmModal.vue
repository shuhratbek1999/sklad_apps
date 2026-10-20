<template>
    <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div
            class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div class="p-6 text-center">
                <div
                    class="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    ⚠️
                </div>

                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Haqiqatan ham o'chirmoqchimisiz?
                </h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Ushbu amalni ortga qaytarib bo'lmaydi. Bu kategoriya butunlay o'chiriladi.
                </p>

                <div class="flex gap-3">
                    <button @click="$emit('close')"
                        class="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors">
                        Bekor qilish
                    </button>
                    <button @click="$emit('confirm')" :disabled="loading"
                        class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center">
                        <span v-if="loading">O'chirilmoqda...</span>
                        <span v-else>Ha, o'chirish</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    show: Boolean,
    loading: Boolean
})
defineEmits(['close', 'confirm'])
</script>