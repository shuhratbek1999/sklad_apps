<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="category_id" class="block text-sm font-medium text-gray-700 mb-1">
        Kategoriya *
      </label>
      <select id="category_id" v-model="form.values.category_id" @blur="form.handleBlur('category_id')" :class="[
        'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white',
        form.errors.category_id ? 'border-danger-500' : 'border-gray-300'
      ]">
        <option value="" disabled>Kategoriyani tanlang</option>
        <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <p v-if="form.errors.category_id" class="mt-1 text-sm text-danger-600">
        {{ form.errors.category_id }}
      </p>
    </div>

    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
        Maxsulot Nomi *
      </label>
      <input id="name" v-model="form.values.name" @blur="form.handleBlur('name')" type="text" :class="[
        'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        form.errors.name ? 'border-danger-500' : 'border-gray-300'
      ]" placeholder="Masalan: iPhone 14 Pro" />
      <p v-if="form.errors.name" class="mt-1 text-sm text-danger-600">
        {{ form.errors.name }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Maxsulot Rasmi
      </label>
      <div @click="triggerFileInput"
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors">
        <div v-if="imagePreview" class="relative">
          <img :src="imagePreview" alt="Preview" class="mx-auto max-h-48 rounded-lg" />
          <button type="button" @click.stop="removeImage"
            class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100">
            <span class="text-danger-600 text-lg">×</span>
          </button>
        </div>
        <div v-else>
          <div class="mx-auto w-12 h-12 text-gray-400 mb-2">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-sm text-gray-600">Rasm yuklash uchun bosing</p>
        </div>
        <input ref="fileInput" type="file" accept="image/*" @change="handleImageSelect" class="hidden" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
          Narxi (UZS) *
        </label>
        <input id="price" v-model.number="form.values.price" @blur="form.handleBlur('price')" type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="10000" />
        <p v-if="form.errors.price" class="mt-1 text-sm text-danger-600">{{ form.errors.price }}</p>
      </div>

      <div>
        <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">
          Miqdori (ta) *
        </label>
        <input id="quantity" v-model.number="form.values.quantity" @blur="form.handleBlur('quantity')" type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="100" />
        <p v-if="form.errors.quantity" class="mt-1 text-sm text-danger-600">{{ form.errors.quantity }}</p>
      </div>
    </div>

    <div class="flex space-x-3 pt-4">
      <Button type="button" @click="$emit('cancel')" variant="outline" class="flex-1" :disabled="isSubmitting">
        Bekor qilish
      </Button>
      <Button type="submit" variant="primary"
        class="flex-1 text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-bold" :loading="isSubmitting"
        :disabled="!isFormValid || isSubmitting">
        {{ isSubmitting ? 'Saqlanmoqda...' : 'Saqlash' }}
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useForm, productSchema } from '@/composables/useForm'
import { useImageUpload } from '@/composables/useImageUpload'
import { useCategoryStore } from '@/stores/categoryStore' // Category Store
import Button from '@/components/ui/Button.vue'

const props = defineProps({
  loading: Boolean,
  initialValues: {
    type: Object,
    default: () => ({
      name: '',
      price: '',
      quantity: '',
      category_id: '', // URL'dan kelgan ID shu yerga tushadi
      image: null
    })
  }
})

const emit = defineEmits(['submit', 'cancel'])
const categoryStore = useCategoryStore()

// Form setup - props.initialValues ni bevosita ishlatamiz
const form = useForm(props.initialValues, productSchema)

const isSubmitting = computed(() => form.isSubmitting.value || props.loading)
const isFormValid = computed(() => form.isValid.value)

// Kategoriyalarni yuklash
onMounted(async () => {
  await categoryStore.fetchCategories()
})

// Image upload mantiqi
const fileInput = ref(null)
const imageUpload = useImageUpload()
const { imagePreview, imageFile, error: imageError } = imageUpload

const handleImageSelect = (event) => {
  imageUpload.handleFileSelect(event)
  if (imageFile.value) {
    form.values.image = imageFile.value
  }
}

const removeImage = () => {
  imageUpload.removeImage()
  form.values.image = null
}

const triggerFileInput = () => {
  imageUpload.triggerFileInput(fileInput)
}

const handleSubmit = async () => {
  await form.handleSubmit(async (readyFormData) => {
    console.log(readyFormData);

    emit('submit', readyFormData)
  })
}
</script>