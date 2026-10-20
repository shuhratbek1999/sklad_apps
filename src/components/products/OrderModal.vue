<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Mahsulotga buyurtma berish</h3>
            <p class="text-sm text-gray-600 mb-4">Mahsulot: <strong>{{ product.name }}</strong></p>

            <form @submit.prevent="handleSubmit">
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Buyurtma miqdori (soni)</label>
                    <input v-model.number="quantity" type="number" min="1"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        required placeholder="Nechta buyurtma qilmoqchisiz?" />
                </div>

                <div class="flex gap-3">
                    <Button @click="$emit('close')" variant="outline" type="button" class="flex-1">Bekor qilish</Button>
                    <Button variant="primary" type="submit" :loading="loading" class="flex-1">Tasdiqlash</Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'

const props = defineProps(['product', 'loading'])
const emit = defineEmits(['close', 'submit'])

const quantity = ref(1)

const handleSubmit = () => {
    if (quantity.value > 0) {
        emit('submit', {
            product_id: props.product.id,
            quantity: quantity.value
        })
    }
}
</script>