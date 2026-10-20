<template>
  <Modal :show="true" @close="$emit('close')" title="Zaxira Qo'shish">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Qo'shiladigan miqdor
        </label>
        <input v-model="quantity" type="number" min="1" required class="input" placeholder="Masalan: 100" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Yangi narx (UZS)
        </label>
        <input v-model="price" type="number" min="0" step="100" required class="input"
          :placeholder="`Joriy narx: ${formatCurrency(product.price)}`" />
      </div>

      <div class="flex space-x-3 pt-4">
        <Button type="button" @click="$emit('close')" variant="outline" class="flex-1" :disabled="loading">
          Bekor qilish
        </Button>
        <Button type="submit" variant="success" class="flex-1" :loading="loading" :disabled="!quantity || !price">
          Qo'shish
        </Button>
      </div>
    </form>
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

const handleSubmit = () => {
  emit('submit', {
    quantity: parseInt(quantity.value),
    price: parseFloat(price.value)
  })
}
</script>