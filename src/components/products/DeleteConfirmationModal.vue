<template>
  <Modal :show="true" @close="$emit('close')" title="Maxsulotni o'chirish">
    <div class="space-y-4">
      <!-- Warning Icon -->
      <div class="flex justify-center">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <span class="text-4xl text-red-600">⚠️</span>
        </div>
      </div>

      <!-- Message -->
      <div class="text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          "{{ product?.name }}" ni o'chirish
        </h3>
        <p class="text-sm text-gray-600 mb-1">
          Bu maxsulotni o'chirishni tasdiqlaysizmi?
        </p>
        <p class="text-xs text-red-600 font-medium">
          ⚠️ Bu amalni qaytarib bo'lmaydi!
        </p>
        <div class="mt-3 p-3 bg-gray-50 rounded-lg text-left">
          <p class="text-xs text-gray-600">
            <span class="font-medium">ID:</span> {{ product?.id }}<br>
            <span class="font-medium">Nomi:</span> {{ product?.name }}<br>
            <span class="font-medium">Miqdori:</span> {{ product?.quantity }} ta<br>
            <span class="font-medium">Narxi:</span> {{ formatCurrency(product?.price) }}<br>
            <span class="font-medium">Umumiy qiymat:</span> {{ formatCurrency(product?.price * product?.quantity) }}
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex space-x-3 pt-4">
        <Button type="button" @click="$emit('close')" variant="outline" class="flex-1" :disabled="loading">
          Bekor qilish
        </Button>
        <Button type="button" @click="$emit('confirm')" variant="danger" class="flex-1" :loading="loading">
          {{ loading ? 'O\'chirilmoqda...' : 'O\'chirish' }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { formatCurrency } from '@/utils/formatters'

defineProps({
  product: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm', 'close'])
</script>