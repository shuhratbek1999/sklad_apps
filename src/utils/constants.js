export const API_CONFIG = {
  // BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
   BASE_URL: "https://sklad.net.uz/api",
  //  BASE_URL: "https://api2.qurilishcrm.com.uz/api",
  TIMEOUT: 10000,
  UPLOAD_URL: import.meta.env.VITE_UPLOAD_URL || 'https://sklad.net.uz/api/uploads'
}

export const STOCK_STATUS = {
  IN_STOCK: 'inStock',
  LOW_STOCK: 'lowStock',
  OUT_OF_STOCK: 'outOfStock'
}

export const TRANSACTION_TYPES = {
  ADD: 'add',
  SELL: 'sell'
}

export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}