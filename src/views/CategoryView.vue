<template>
    <div class="p-4 sm:p-6 space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button @click="$router.back()" variant="outline" icon="←">
                Ortga
            </Button>
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Kategoriyalar</h1>
                <p class="text-sm text-gray-500">Mahsulotlarni guruhlash uchun kategoriyalarni boshqaring</p>
            </div>
            <button @click="openModal()"
                class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                <span>➕</span> Yangi kategoriya
            </button>
        </div>

        <div v-if="categoryStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="category in categoryStore.categories" :key="category.id"
                class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group">
                <div class="relative h-32 bg-gray-50">
                    <img :src="getImageUrl(category.image_url)"
                        class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div
                        class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button @click="openModal(category)"
                            class="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50">✏️</button>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-gray-900 dark:text-white truncate">{{ category.name }}</h3>
                    <p class="text-xs text-gray-500 mt-1">{{ category.products?.length || 0 }} mahsulot</p>
                </div>
            </div>
        </div>

        <div v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="text-lg font-bold">{{ editMode ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya' }}</h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-semibold mb-1">Nomi</label>
                        <input v-model="form.name" type="text" required
                            class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-1">Rasm (ixtiyoriy)</label>
                        <input type="file" @change="handleFileChange" accept="image/*"
                            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <button v-if="editMode" type="button" @click="confirmDelete(form.id)"
                        class="w-full px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl text-sm font-medium transition-colors border border-transparent hover:border-red-100">
                        🗑️ Ushbu kategoriyani o'chirish
                    </button>
                    <div class="flex gap-3 pt-2">
                        <button type="button" @click="closeModal"
                            class="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">Bekor
                            qilish</button>
                        <button type="submit" :disabled="categoryStore.loading"
                            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50">
                            {{ categoryStore.loading ? 'Saqlanmoqda...' : 'Saqlash' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div class="p-4 sm:p-6 space-y-6">
            <DeleteConfirmModal :show="isDeleteModalOpen" :loading="categoryStore.loading"
                @close="isDeleteModalOpen = false" @confirm="handleDelete" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useImageUpload } from '@/composables/useImageUpload'
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal.vue'
import { useToast } from '@/plugins/toast'
import Button from '@/components/ui/Button.vue'
const toast = useToast()
const isDeleteModalOpen = ref(false)
const categoryToDelete = ref(null)
const categoryStore = useCategoryStore()
const isModalOpen = ref(false)
const editMode = ref(false)
const selectedFile = ref(null)
const { getImageUrl } = useImageUpload()
const form = reactive({
    id: null,
    name: ''
})

onMounted(() => categoryStore.fetchCategories())

const openModal = (category = null) => {
    if (category) {
        editMode.value = true
        form.id = category.id
        form.name = category.name
    } else {
        editMode.value = false
        form.id = null
        form.name = ''
    }
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    selectedFile.value = null
}

const handleFileChange = (e) => {
    selectedFile.value = e.target.files[0]
}

const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('name', form.name)
    if (selectedFile.value) formData.append('image', selectedFile.value)

    let success
    if (editMode.value) {
        success = await categoryStore.updateCategory(form.id, formData)
    } else {
        success = await categoryStore.addCategory(formData)
    }

    if (success) closeModal()
}

const confirmDelete = (id) => {
    categoryToDelete.value = id
    isDeleteModalOpen.value = true
}
const handleDelete = async () => {
    if (categoryToDelete.value) {
        const success = await categoryStore.removeCategory(categoryToDelete.value)
        if (success) {
            isDeleteModalOpen.value = false
            isModalOpen.value = false // Tahrirlash modalini ham yopamiz
            categoryToDelete.value = null
            toast.success('Kategoriya o\'chirildi') // Toastingiz bo'lsa
        }
    }
}
</script>