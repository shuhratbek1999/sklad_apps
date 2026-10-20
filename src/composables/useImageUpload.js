import { ref } from 'vue'

export function useImageUpload(options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  } = options

  const imageFile = ref(null)
  const imagePreview = ref(null)
  const error = ref(null)
  const uploading = ref(false)
  const uploadProgress = ref(0)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Fayl turini tekshirish
    if (!allowedTypes.includes(file.type)) {
      error.value = 'Faqat JPEG, PNG, GIF yoki WebP formatidagi rasmlar ruxsat etilgan'
      return
    }

    // Fayl hajmini tekshirish
    if (file.size > maxSize) {
      error.value = `Rasm hajmi ${maxSize / 1024 / 1024}MB dan oshmasligi kerak`
      return
    }

    error.value = null
    imageFile.value = file

    // Prevyu yaratish
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    imageFile.value = null
    imagePreview.value = null
    error.value = null
  }

  const triggerFileInput = (inputRef) => {
    if (inputRef && inputRef.value) {
      inputRef.value.click()
    }
  }

  const simulateUpload = () => {
    return new Promise((resolve) => {
      uploading.value = true
      uploadProgress.value = 0

      const interval = setInterval(() => {
        uploadProgress.value += 10
        if (uploadProgress.value >= 100) {
          clearInterval(interval)
          uploading.value = false
          resolve(true)
        }
      }, 100)
    })
  }

  const getImageUrl = (filename) => {
    if (!filename) return null
    if (filename.startsWith('http')) return filename
    
    // const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const baseUrl = "https://sklad.net.uz"
    // Agar relative path bo'lsa
    if (filename.startsWith('/')) {
      return `${baseUrl}${filename}`
    }
    // Agar faqat filename bo'lsa
    return `${baseUrl}/uploads/products/${filename}`
  }

  return {
    imageFile,
    imagePreview,
    error,
    uploading,
    uploadProgress,
    handleFileSelect,
    removeImage,
    triggerFileInput,
    simulateUpload,
    getImageUrl
  }
}