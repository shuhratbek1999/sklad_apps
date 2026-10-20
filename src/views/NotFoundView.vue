<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center">
      <div class="text-9xl text-gray-300 mb-4">404</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Sahifa topilmadi</h1>
      <p class="text-gray-600 mb-6">Siz qidirgan sahifa mavjud emas yoki o'chirilgan</p>
      <Button @click="$router.push('/')" variant="primary" icon="🏠">
        Asosiy sahifaga qaytish
      </Button>
    </div>
  </div>
</template>

<script setup>
import Button from '@/components/ui/Button.vue'
</script>