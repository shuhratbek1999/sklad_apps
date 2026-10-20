<template>
  <div class="animate-fade-in">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2 my-2">
          <h1 class="md:text-2xl text-base font-bold text-gray-900">Yangi Maxsulot Qo'shish</h1>
          <Button @click="$router.back()" variant="outline" icon="←">
            Ortga
          </Button>
        </div>
        <p class="text-gray-600 text-sm">Yangi maxsulot ma'lumotlarini kiriting va uni inventarizatsiyaga qo'shing</p>
      </div>

      <Card class="mb-6">
        <ProductForm :loading="loading" :initial-values="initialFormData" @submit="handleSubmit"
          @cancel="$router.back()" />
      </Card>

      <div v-if="uploadProgress > 0" class="mb-6 px-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Rasm yuklanmoqda...</span>
          <span class="text-sm font-medium text-blue-600">{{ uploadProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"></div>
        </div>
      </div>

      <div v-if="success" class="fixed inset-x-4 bottom-4 sm:bottom-6 z-50 animate-slide-up">
        <div class="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
          <div class="flex items-center">
            <div class="flex-shrink-0 text-2xl">✅</div>
            <div class="ml-3 flex-1">
              <h3 class="text-sm font-medium text-green-800">Maxsulot muvaffaqiyatli qo'shildi!</h3>
              <p class="mt-1 text-sm text-green-700">Siz yo'naltirilmoqdasiz...</p>
            </div>
            <button @click="success = false" class="ml-3 text-green-400 hover:text-green-500 text-xl">×</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router' // useRoute qo'shildi
import { useProducts } from '@/composables/useProducts'
import { useToast } from '@/plugins/toast'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import ProductForm from '@/components/products/ProductForm.vue'

const router = useRouter()
const route = useRoute() // Route obyektini olamiz
const { createProduct } = useProducts()
const toast = useToast()

const loading = ref(false)
const success = ref(false)
const uploadProgress = ref(0)

const initialFormData = computed(() => ({
  category_id: route.query.category_id || ''
}))

const handleSubmit = async (formData) => {
  loading.value = true
  uploadProgress.value = 0

  try {
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) uploadProgress.value += 10
    }, 150)

    await createProduct(formData)

    clearInterval(progressInterval)
    uploadProgress.value = 100
    success.value = true

    toast.success('Maxsulot muvaffaqiyatli qo\'shildi!')

    setTimeout(() => {
      if (route.query.category_id) {
        router.push(`/category/${route.query.category_id}/products`)
      } else {
        router.push('/')
      }
    }, 1500)

  } catch (error) {
    toast.error(error.message || 'Xatolik yuz berdi')
    uploadProgress.value = 0
  } finally {
    loading.value = false
  }
}
</script>