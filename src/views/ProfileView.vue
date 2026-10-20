<template>
    <div class="max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="bg-blue-600 px-6 py-8 sm:px-8 sm:py-12 text-white">
                <div
                    class="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
                    <div
                        class="h-20 w-20 sm:h-24 sm:w-24 bg-white/20 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold backdrop-blur-md border border-white/30">
                        {{ authStore.user?.login?.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold">Admin Profili</h1>
                        <p class="text-blue-100 text-sm sm:text-base opacity-90">Tizim sozlamalari va shaxsiy
                            ma'lumotlar</p>
                    </div>
                </div>
            </div>

            <div class="p-6 sm:p-8">
                <form @submit.prevent="handleUpdate" class="space-y-6">
                    <transition name="fade">
                        <div v-if="authStore.error"
                            class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm sm:text-base">
                            {{ authStore.error }}
                        </div>
                    </transition>
                    <transition name="fade">
                        <div v-if="successMessage"
                            class="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-md text-sm sm:text-base">
                            {{ successMessage }}
                        </div>
                    </transition>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        <div class="space-y-1.5">
                            <label class="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Login</label>
                            <input v-model="form.login" type="text"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm sm:text-base"
                                placeholder="Loginni kiriting" />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Eski parol</label>
                            <div class="relative">
                                <input :type="showOldPassword ? 'text' : 'password'" v-model="form.oldPassword"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm sm:text-base"
                                    placeholder="••••••••" />
                                <button type="button" @click="showOldPassword = !showOldPassword"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors">
                                    <component :is="showOldPassword ? EyeOffIcon : EyeIcon" class="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Yangi parol
                                (ixtiyoriy)</label>
                            <div class="relative">
                                <input :type="showNewPassword ? 'text' : 'password'" v-model="form.password"
                                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm sm:text-base"
                                    placeholder="Yangi parol" />
                                <button type="button" @click="showNewPassword = !showNewPassword"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors">
                                    <component :is="showNewPassword ? EyeOffIcon : EyeIcon" class="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Yangi parolni
                                takrorlang</label>
                            <input :type="showNewPassword ? 'text' : 'password'" v-model="form.confirmPassword"
                                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm sm:text-base"
                                placeholder="Yangi parol takrori" />
                        </div>
                    </div>

                    <div
                        class="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
                        <button type="button" @click="authStore.logout()"
                            class="w-full sm:w-auto text-red-600 hover:text-red-700 font-medium px-6 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base text-center">
                            Chiqish (Logout)
                        </button>

                        <button type="submit" :disabled="authStore.loading"
                            class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-2.5 rounded-xl font-bold disabled:opacity-50 shadow-lg shadow-blue-200 transition-all text-sm sm:text-base">
                            <span v-if="authStore.loading">Saqlanmoqda...</span>
                            <span v-else>O'zgarishlarni saqlash</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'

const authStore = useAuthStore()
const successMessage = ref('')

// Ko'zcha holatlari
const showOldPassword = ref(false)
const showNewPassword = ref(false)

const form = reactive({
    login: authStore.user?.login || '',
    oldPassword: '',
    password: '',
    confirmPassword: ''
})

const handleUpdate = async () => {
    if (form.password && form.password !== form.confirmPassword) {
        alert("Yangi parollar bir-biriga mos kelmadi!")
        return
    }

    const success = await authStore.updateProfile({
        login: form.login,
        oldPassword: form.oldPassword,
        password: form.password || undefined
    })

    if (success) {
        successMessage.value = "Profil muvaffaqiyatli yangilandi!"
        form.oldPassword = ''
        form.password = ''
        form.confirmPassword = ''
        setTimeout(() => successMessage.value = '', 3000)
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>