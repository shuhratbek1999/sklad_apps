<template>
  <Modal 
    :show="show" 
    @close="$emit('close')" 
    :title="type === 'add' ? 'Zaxira Qo\'shish' : 'Maxsulot Sotish'"
    size="md"
  >
    <div v-if="type === 'add'">
      <AddStockModal
        :product="product"
        :loading="loading"
        @submit="$emit('submit', $event)"
        @close="$emit('close')"
      />
    </div>
    
    <div v-else>
      <SellProductModal
        :product="product"
        :loading="loading"
        @submit="$emit('submit', $event)"
        @close="$emit('close')"
      />
    </div>
  </Modal>
</template>

<script setup>
import Modal from '@/components/ui/Modal.vue'
import AddStockModal from './AddStockModal.vue'
import SellProductModal from './SellProductModal.vue'

defineProps({
  show: Boolean,
  type: {
    type: String,
    required: true,
    validator: (value) => ['add', 'sell'].includes(value)
  },
  product: {
    type: Object,
    required: true
  },
  loading: Boolean
})

defineEmits(['submit', 'close'])
</script>