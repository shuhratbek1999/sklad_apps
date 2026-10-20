<template>
  <div class="animate-fade-in">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="spinner"></div>
      <p class="mt-4 text-gray-600">Maxsulot ma'lumotlari yuklanmoqda...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-danger-600 mb-4">❌ {{ error }}</div>
      <Button @click="fetchProductData" variant="primary">Qayta yuklash</Button>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="max-w-4xl mx-auto">
      <div class="my-6 flex items-center justify-between">
        <Button @click="$router.back()" variant="outline" icon="←" class="mb-4">
          Ortga
        </Button>
        <div class="border-t border-gray-200 mb-4">
          <Button @click="confirmDelete" variant="danger" icon="🗑️" class="w-full" :loading="deleteLoading">
            o'chirish
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column: Product Info -->
        <div>
          <Card class="mb-6">
            <div class="mb-6">
              <div
                class="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <img v-if="product.image_url" :src="getImageUrl(product.image_url)" :alt="product.name"
                  class="w-full h-full object-cover" @error="handleImageError" />
                <div v-else class="text-gray-400 text-8xl">📦</div>
                <div class="absolute top-3 right-3">
                  <span :class="[
                    'badge text-xl! font-semibold',
                    product.quantity === 0 ? 'badge-danger' :
                      product.quantity < 10 ? 'badge-warning' : 'badge-success'
                  ]">
                    {{ product.quantity }} ta
                  </span>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <div class="title flex justify-between items-center">
                  <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>
                  <button @click="openEditModal"
                    class="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                    🖊️
                  </button>
                </div>
                <p class="text-lg font-semibold text-primary-600 mt-1">
                  {{ lastAddPrice }}
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-3">
                  <p class="text-sm text-gray-600">Umumiy qiymat</p>
                  <p class="text-sm font-semibold text-gray-900">
                    {{ formatCurrency(product.price * product.quantity) }}
                  </p>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <p class="text-sm text-gray-600">Maxsulot ID</p>
                  <p class="text-lg font-semibold text-gray-900">#{{ product.id }}</p>
                </div>
              </div>
              <div v-if="product.createdAt || product.updatedAt" class="pt-4 border-t border-gray-200">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Qo'shilgan sana</p>
                    <p class="text-sm font-medium">{{ formatDate(product.createdAt) }}</p>
                  </div>
                  <div v-if="product.updatedAt">
                    <p class="text-sm text-gray-600">Yangilangan</p>
                    <p class="text-sm font-medium">{{ formatDate(product.updatedAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Action Buttons -->
          <div class="mb-3">
            <Button @click="openOrderModal" variant="primary" icon="📝" class="w-full" :disabled="loading">
              Buyurtma berish
            </Button>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <Button @click="openAddStockModal" variant="success" icon="➕" :disabled="loading">
              Zaxira Qo'shish
            </Button>
            <Button @click="openSellModal" variant="primary" icon="💰" :disabled="product.quantity === 0 || loading">
              Sotish
            </Button>
          </div>
        </div>

        <!-- Right Column: Transactions (commented out) -->
        <div>
          <!-- ... transactions code ... -->
        </div>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">❓</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Maxsulot topilmadi</h3>
      <p class="text-gray-600 mb-6">ID: {{ productId }} raqamli maxsulot mavjud emas</p>
      <Button @click="$router.back()" variant="primary" icon="←">
        Ortga qaytish
      </Button>
    </div>
    <OrderModal v-if="showOrderModal" :product="product" :loading="transactionLoading" @submit="handleOrderSubmit"
      @close="closeOrderModal" />
    <AddStockModal v-if="showAddStockModal" :product="product" @submit="handleAddStock" @close="closeAddStockModal"
      :loading="transactionLoading" />

    <SellProductModal v-if="showSellModal" :product="product" @submit="handleSellProduct" @close="closeSellModal"
      :loading="transactionLoading" />

    <DeleteConfirmationModal v-if="showDeleteModal" :product="product" @confirm="handleDelete" @close="closeDeleteModal"
      :loading="deleteLoading" />

    <div v-if="showEditModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold">Mahsulotni tahrirlash</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mahsulot nomi</label>
            <input v-model="editData.name" type="text"
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nomini kiriting" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sotuv narxi (so'mda)</label>
            <input v-model.number="editData.price" type="number"
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Narxini kiriting" />
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <Button @click="closeEditModal" variant="outline" class="flex-1">Bekor qilish</Button>
          <Button @click="handleUpdateProduct" variant="primary" class="flex-1" :loading="transactionLoading">
            Saqlash
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useImageUpload } from '@/composables/useImageUpload'
import { formatCurrency, formatDate } from '@/utils/formatters'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { useOrderStore } from '@/stores/orderStore'
import OrderModal from '@/components/products/OrderModal.vue'
import AddStockModal from '@/components/products/AddStockModal.vue'
import SellProductModal from '@/components/products/SellProductModal.vue'
import DeleteConfirmationModal from '@/components/products/DeleteConfirmationModal.vue'
import { useToast } from '@/plugins/toast'
const showEditModal = ref(false)
const editData = ref({ name: '', price: 0 })
const toast = useToast()
const route = useRoute()
const router = useRouter()
const productId = route.params.id
const orderStore = useOrderStore()
const productStore = useProductStore()
const showOrderModal = ref(false)
const product = computed(() => productStore.currentProduct)
const loading = computed(() => productStore.loading)
const error = computed(() => productStore.error)

const lastAddPrice = computed(() => {
  if (!product.value || !product.value.transactions) {
    return formatCurrency(product.value?.price || 0);
  }

  const txs = Array.isArray(product.value.transactions) ? product.value.transactions : [];
  const addTransactions = txs.filter(t =>
    t.type && t.type.toLowerCase() === 'add'
  );

  if (addTransactions.length === 0) {
    return formatCurrency(product.value?.price || 0);
  }

  const lastEntry = addTransactions[addTransactions.length - 1];
  return formatCurrency(lastEntry.price || product.value?.price || 0);
});

const { getImageUrl } = useImageUpload()
const showAddStockModal = ref(false)
const showSellModal = ref(false)
const showDeleteModal = ref(false)
const transactionLoading = ref(false)
const deleteLoading = ref(false)
const openOrderModal = () => {
  showOrderModal.value = true
}
const closeOrderModal = () => {
  showOrderModal.value = false
}
const openEditModal = () => {
  editData.value = {
    name: product.value.name,
    price: product.value.price
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}
const handleUpdateProduct = async () => {
  transactionLoading.value = true
  try {
    const formData = new FormData()
    formData.append('name', editData.value.name)
    formData.append('price', editData.value.price)

    await productStore.updateProduct(productId, formData)
    toast.success('Mahsulot muvaffaqiyatli yangilandi')
    closeEditModal()
    await fetchProductData() // Ma'lumotni qayta yuklash
  } catch (err) {
    toast.error(err.response?.data?.message || 'Yangilashda xatolik')
  } finally {
    transactionLoading.value = false
  }
}
const handleOrderSubmit = async (orderData) => {
  transactionLoading.value = true
  try {
    const payload = {
      items: [
        {
          product_id: orderData.product_id,
          quantity: orderData.quantity,
          price: product.value.price
        }
      ],
      order_date: new Date()
    }
    await orderStore.createOrder(payload)
    closeOrderModal()
    toast.success('Buyurtma muvaffaqiyatli yaratildi!')

    await fetchProductData()

  } catch (err) {
    console.error('Order Error:', err)
    const errorMessage = err.response?.data?.message || 'Buyurtma yaratishda xatolik yuz berdi'
    toast.error(errorMessage)
  } finally {
    transactionLoading.value = false
  }
}
onMounted(() => {
  fetchProductData()
})

const fetchProductData = async () => {
  try {
    await productStore.fetchProductById(productId)
    console.log('Product loaded:', product.value);
  } catch (err) {
    console.error('Error in fetchProductData:', err)
  }
}

// Stock operations
const openAddStockModal = () => {
  showAddStockModal.value = true
}

const closeAddStockModal = () => {
  showAddStockModal.value = false
}

const handleAddStock = async (stockData) => {
  transactionLoading.value = true
  try {
    await productStore.addStock(productId, stockData)
    closeAddStockModal()
    await fetchProductData()
  } catch (err) {
    console.error('Error adding stock:', err)
  } finally {
    transactionLoading.value = false
  }
}

// Sell operations
const openSellModal = () => {
  showSellModal.value = true
}

const closeSellModal = () => {
  showSellModal.value = false
}

const handleSellProduct = async (sellData) => {
  transactionLoading.value = true
  try {
    await productStore.sellProduct(productId, sellData)
    closeSellModal()
    await fetchProductData()
  } catch (err) {
    console.error('Error selling product:', err)
  } finally {
    transactionLoading.value = false
  }
}

// 🗑️ DELETE operations
const confirmDelete = () => {
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const handleDelete = async () => {
  deleteLoading.value = true
  try {
    await productStore.deleteProduct(productId)
    // Redirect to home page after successful deletion
    router.push('/')
  } catch (err) {
    console.error('Error deleting product:', err)
  } finally {
    deleteLoading.value = false
  }
}


const handleImageError = (event) => {
  event.target.src = null
  event.target.parentElement.innerHTML = '<div class="text-gray-400 text-8xl">📦</div>'
}
</script>

<style scoped>
.spinner {
  @apply w-12 h-12 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin mx-auto;
}

.badge {
  @apply px-2 py-1 rounded-full text-xs font-semibold;
}

.badge-success {
  @apply bg-success-100 text-success-800;
}

.badge-warning {
  @apply bg-warning-100 text-warning-800;
}

.badge-danger {
  @apply bg-danger-100 text-danger-800;
}
</style>