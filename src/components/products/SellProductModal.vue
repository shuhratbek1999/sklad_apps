<template>
  <Modal :show="true" @close="$emit('close')" title="Maxsulot Sotish" :size="'sm'">
    <!-- Product Info -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <span class="text-2xl">📦</span>
        </div>
        <div>
          <h4 class="font-medium text-gray-900">{{ product.name }}</h4>
          <p class="text-sm text-gray-600">
            Mavjud: {{ product.quantity }} ta
          </p>
          <p class="text-sm text-gray-600">
            Narx: {{ formatCurrency(product.price) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Quantity -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Sotiladigan miqdor *
      </label>
      <input v-model="quantity" type="number" min="1" :max="product.quantity" required class="input w-full"
        placeholder="Masalan: 10" :class="{ 'border-red-500': quantityError }" @input="validateQuantity" />
      <p v-if="quantityError" class="mt-1 text-sm text-red-600">
        {{ quantityError }}
      </p>
      <p class="mt-1 text-sm text-gray-500">
        Maksimum: {{ product.quantity }} ta
      </p>
    </div>

    <!-- Price -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Sotish narxi (UZS) *
      </label>
      <input v-model="price" type="number" min="0" step="100" required class="input w-full"
        :placeholder="`Joriy narx: ${formatCurrency(product.price)}`" />
      <p class="mt-1 text-sm text-gray-500">
        Joriy narx: {{ formatCurrency(product.price) }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex space-x-3">
      <Button type="button" @click="$emit('close')" variant="outline" class="flex-1" :disabled="loading">
        Bekor qilish
      </Button>
      <Button type="button" @click="handleSubmit" variant="primary" class="flex-1" :loading="loading"
        :disabled="!quantity || !price">
        {{ loading ? 'Sotilmoqda...' : 'Sotish' }}
      </Button>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  loading: Boolean
})

const emit = defineEmits(['submit', 'close'])

const quantity = ref('')
const price = ref(null)
const quantityError = ref('')

const validateQuantity = () => {
  const qty = parseInt(quantity.value) || 0

  if (qty <= 0) {
    quantityError.value = 'Miqdor 0 dan katta bo\'lishi kerak'
  } else if (qty > props.product.quantity) {
    quantityError.value = `Mavjud miqdordan ko'p. Maksimum: ${props.product.quantity} ta`
  } else {
    quantityError.value = ''
  }
}

const handleSubmit = () => {
  validateQuantity()

  if (!quantityError.value) {
    const submitData = {
      quantity: parseInt(quantity.value),
      price: parseFloat(price.value)
    }

    emit('submit', submitData)
  }
}
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}
</style>