<template>
  <div role="button" tabindex="0"
    class="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-gray-700 dark:bg-gray-800"
    @click="handleClick" @keydown.enter.prevent="handleClick" @keydown.space.prevent="handleClick">
    <!-- Rasm -->
    <div class="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <img v-if="showImage" :src="imageUrl" :alt="product.name || 'Mahsulot rasmi'"
        class="block h-full w-full object-contain object-center p-2 sm:p-3 transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy" decoding="async" @error="handleImageError" />

      <!-- Rasm bo'lmaganda -->
      <div v-else
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
        <span class="text-4xl sm:text-5xl" aria-hidden="true">
          📦
        </span>
        <span class="text-[10px] sm:text-xs text-center">
          Rasm mavjud emas
        </span>
      </div>

      <!-- Qoldiq badge -->
      <div class="absolute right-2 top-2 z-10">
        <span :class="stockBadgeClass"
          class="inline-flex min-w-7 items-center justify-center rounded-full border border-white/70 px-2 py-1 text-[11px] font-bold shadow-sm dark:border-gray-700">
          {{ quantity }}
        </span>
      </div>
    </div>

    <!-- Mahsulot nomi -->
    <div class="flex flex-1 flex-col justify-center border-t border-gray-100 p-2.5 sm:p-3 dark:border-gray-700">
      <h3
        class="line-clamp-2 min-h-[2.5rem] text-center text-xs font-semibold leading-5 text-gray-900 break-words sm:text-sm dark:text-white"
        :title="product.name">
        {{ product.name || 'Nomsiz mahsulot' }}
      </h3>

      <p class="mt-1 text-center text-[10px] font-medium sm:text-xs" :class="stockTextClass">
        {{ stockText }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useImageUpload } from '@/composables/useImageUpload'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])
const { getImageUrl } = useImageUpload()

const brokenImageUrl = ref('')

const uploadBase = (
  import.meta.env.VITE_UPLOAD_URL ||
  'https://api2.qurilishcrm.com.uz'
).replace(/\/+$/, '')

// Rasm URL'ini to'g'ri hosil qilish
const imageUrl = computed(() => {
  const raw = props.product?.image_url ||
    props.product?.image ||
    props.product?.imageUrl

  if (!raw) return ''

  let src

  try {
    src = getImageUrl(raw) || raw
  } catch {
    src = raw
  }

  try {
    const url = new URL(String(src), `${uploadBase}/`)

    if (!['http:', 'https:'].includes(url.protocol)) {
      return ''
    }

    // Eski mijoz API manzilini yangisiga moslash
    if (
      url.hostname === 'sklad.net.uz' &&
      url.pathname.startsWith('/uploads/')
    ) {
      return `${uploadBase}${url.pathname}${url.search}`
    }

    return url.href
  } catch {
    return ''
  }
})

// Rasmni ko'rsatish yoki placeholder
const showImage = computed(() => {
  return Boolean(
    imageUrl.value &&
    brokenImageUrl.value !== imageUrl.value
  )
})

const handleImageError = () => {
  brokenImageUrl.value = imageUrl.value
}

// Mahsulot qoldig'i
const quantity = computed(() => {
  const value = Number(props.product?.quantity ?? 0)
  return Number.isFinite(value) ? value : 0
})

const stockBadgeClass = computed(() => {
  if (quantity.value <= 0) {
    return 'bg-red-100 text-red-700 dark:bg-red-900/90 dark:text-red-100'
  }

  if (quantity.value < 10) {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/90 dark:text-amber-100'
  }

  return 'bg-green-100 text-green-700 dark:bg-green-900/90 dark:text-green-100'
})

const stockText = computed(() => {
  if (quantity.value <= 0) return 'Tugagan'
  if (quantity.value < 10) return 'Kam zaxira'
  return 'Mavjud'
})

const stockTextClass = computed(() => {
  if (quantity.value <= 0) return 'text-red-600 dark:text-red-400'
  if (quantity.value < 10) return 'text-amber-600 dark:text-amber-400'
  return 'text-green-600 dark:text-green-400'
})

const handleClick = () => {
  emit('click', props.product)
}
</script>
