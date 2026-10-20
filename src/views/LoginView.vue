<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900">Sklad Tizimi</h2>
                <p class="mt-2 text-sm text-gray-600">Admin panelga kirish</p>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div v-if="authStore.error"
                    class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 text-center">
                    {{ authStore.error }}
                </div>

                <div class="rounded-md shadow-sm space-y-4">
                    <div>
                        <label class="text-sm font-medium text-gray-700">Login</label>
                        <input v-model="form.login" type="text" required
                            class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Admin login">
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700">Parol</label>
                        <input v-model="form.password" type="password" required
                            class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="••••••••">
                    </div>
                </div>

                <div>
                    <button :disabled="authStore.loading" type="submit"
                        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all">
                        <span v-if="authStore.loading" class="animate-spin mr-2">⏳</span>
                        {{ authStore.loading ? 'Kirilmoqda...' : 'Tizimga kirish' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
    login: '',
    password: ''
})

const handleLogin = async () => {
    const success = await authStore.login(form)
    console.log(success);

    if (success) {
        router.push('/')
    }
}
</script>