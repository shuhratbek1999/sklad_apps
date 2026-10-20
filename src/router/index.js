import { createRouter, createWebHistory } from 'vue-router'
import LowStockView from '@/views/LowStockView.vue'
import OutOfStockView from '@/views/OutOfStockView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { 
      title: 'Kirish', 
      requiresAuth: false, 
      hideHeader: true,
      hideBottomNav: true 
    }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Asosiy',
      icon: '🏠',
      showInNav: true,
      requiresAuth: true // Faqat login qilganlar uchun
    }
  },
  {
    path: '/add',
    name: 'AddProduct',
    component: () => import('../views/AddProductView.vue'),
    meta: {
      title: 'Maxsulot Qo\'shish',
      icon: '➕',
      showInNav: true,
      requiresAuth: true
    }
  },
  {
    path: '/category',
    name: 'CategoryList',
    component: () => import('../views/CategoryView.vue'),
    meta: {
      title: 'Categoriya Qo\'shish',
      icon: '➕',
      showInNav: true,
      requiresAuth: true
    }
  },
  {
  path: '/category/:id/products',
  name: 'CategoryProducts',
  component: () => import('@/views/CategoryProductsView.vue'),
  props: true,
   meta: {
      title: 'Maxsulot Batafsil',
      hideBottomNav: true,
      requiresAuth: true
    }
},
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetailView.vue'),
    meta: {
      title: 'Maxsulot Batafsil',
      hideBottomNav: true,
      requiresAuth: true
    }
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('@/views/OrderDetailView.vue'),
    meta: {
      title: 'Buyurtma detallari',
      hideBottomNav: true,
      requiresAuth: true
    }
  },
  {
    path: '/low-stock',
    name: 'LowStock',
    component: LowStockView,
    meta: { title: 'Kam zaxira', icon: '⚠️', showInNav: false, requiresAuth: true }
  }, 
  {
    path: '/out-of-stock',
    name: 'OutOfStock',
    component: OutOfStockView,
    meta: { title: 'Tugaganlar', icon: '⛔', showInNav: false, requiresAuth: true }
  },
   {
    path: '/debts',
    name: 'DebtsView',
    component: () => import('@/views/DebtsView.vue'),
    meta: { title: 'Hisob kitoblar', icon: '⛔', showInNav: false, requiresAuth: true }
  },
   {
    path: '/credits',
    name: 'CreditsView',
    component: () => import('@/views/CreditsView.vue'),
    meta: { title: 'Hisob kitoblar', icon: '⛔', showInNav: false, requiresAuth: true }
  },
  {
  path: '/debts/history/:id',
  name: 'CustomerHistory',
  component: () => import('@/views/CustomerHistoryView.vue'), 
  meta: { title: 'Tranzaksiyalar tarixi',requiresAuth: true  }
},
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/OrdersView.vue'),
    meta: {
      title: 'Buyurtmalar',
      icon: '📋',
      showInNav: true,
      requiresAuth: true
    }
  },
  {
  path: '/profile',
  name: 'Profile',
  component: () => import('@/views/ProfileView.vue'),
  meta: { 
    title: 'Profil', 
    requiresAuth: true,
    showInNav: false 
  }
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// --- AUTH GUARD VA TITLE ---
router.beforeEach((to, from, next) => {
  const title = to.meta.title || 'Sklad Tizimi'
  document.title = `${title} | Sklad App`

  const token = localStorage.getItem('tokenSklad')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' })
  } 
  else if (to.name === 'Login' && token) {
    next({ name: 'Home' })
  } 
  else {
    next()
  }
})

export default router