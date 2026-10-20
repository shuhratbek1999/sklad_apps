import { ref, reactive, computed } from 'vue'
import * as yup from 'yup'

export function useForm(initialValues = {}, validationSchema = null) {
  const values = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})
  const isSubmitting = ref(false)

  // Form fieldlarni yangilash
  const setFieldValue = (field, value) => {
    values[field] = value
    if (validationSchema) {
      validateField(field)
    }
  }

  // Barcha fieldlarni yangilash
  const setValues = (newValues) => {
    Object.keys(newValues).forEach(key => {
      values[key] = newValues[key]
    })
    if (validationSchema) {
      validateForm()
    }
  }

  // Fieldga tegish
  const handleBlur = (field) => {
    touched[field] = true
    if (validationSchema) {
      validateField(field)
    }
  }

  // Maydonni validatsiya qilish
  const validateField = async (field) => {
    if (!validationSchema) return

    try {
      const fieldSchema = yup.reach(validationSchema, field)
      await fieldSchema.validate(values[field])
      errors[field] = ''
    } catch (error) {
      errors[field] = error.message
    }
  }

  // Butun formani validatsiya qilish
  const validateForm = async () => {
    if (!validationSchema) return true

    try {
      await validationSchema.validate(values, { abortEarly: false })
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
      return true
    } catch (error) {
      error.inner.forEach(err => {
        errors[err.path] = err.message
      })
      return false
    }
  }

  // Formani reset qilish
  const resetForm = () => {
    Object.keys(values).forEach(key => {
      values[key] = initialValues[key] || ''
    })
    Object.keys(errors).forEach(key => {
      errors[key] = ''
    })
    Object.keys(touched).forEach(key => {
      touched[key] = false
    })
    isSubmitting.value = false
  }

 const handleSubmit = async (onSubmit) => {
    isSubmitting.value = true
    
    // Barcha fieldlarni touched qilish
    Object.keys(values).forEach(key => {
      touched[key] = true
    })

    // Validatsiya
    const isValid = await validateForm()
    if (!isValid) {
      isSubmitting.value = false
      return false
    }

    try {
      // FormData yaratish
      const formData = new FormData()
      
      // Har bir maydonni FormData ga qo'shish
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
          // Rasm fayl bo'lsa
          if (values[key] instanceof File) {
            console.log(`Adding image file to FormData: ${values[key].name}`)
            formData.append('image', values[key])
          } 
          // Raqamli maydonlar bo'lsa
          else if (key === 'price' || key === 'quantity' || key === 'category_id') {
            // Raqamni string ga o'girish (FormData string qabul qiladi)
            const numValue = Number(values[key])
            console.log(`Adding ${key}: ${numValue} (as string)`)
            formData.append(key, numValue.toString())
          }
          // String maydonlar bo'lsa
          else {
            console.log(`Adding ${key}: ${values[key]}`)
            formData.append(key, values[key])
          }
        }
      })
      
      // DEBUG: FormData ni tekshirish
      console.log('=== FormData from useForm ===')
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value, `(type: ${typeof value})`)
      }
      
      await onSubmit(formData)
      return true
    } catch (error) {
      errors._global = error.message
      return false
    } finally {
      isSubmitting.value = false
    }
  }


  // Form validligini hisoblash (computed property)
  const isValid = computed(() => {
    // Agar errors bo'sh object bo'lsa yoki xatolik bo'lmasa
    if (!errors || Object.keys(errors).length === 0) {
      return true
    }
    
    // Barcha xatoliklarni tekshirish
    for (const key in errors) {
      const error = errors[key]
      // Agar error string bo'lsa va bo'sh bo'lmasa
      if (typeof error === 'string' && error.trim() !== '') {
        return false
      }
      // Agar error boshqa turda bo'lsa ham tekshirish
      if (error) {
        return false
      }
    }
    
    return true
  })

  return {
    values,
    errors,
    touched,
    isSubmitting, // Bu ref, lekin componentda .value bilan ishlatiladi
    isValid, // Bu computed property, componentda .value bilan ishlatiladi
    setFieldValue,
    setValues,
    handleBlur,
    validateField,
    validateForm,
    resetForm,
    handleSubmit
  }
}

export const productSchema = yup.object({
  name: yup.string().required('Maxsulot nomi majburiy'),
  price: yup.number().required('Narxi majburiy'),
  quantity: yup.number().required('Miqdori majburiy'),
  category_id: yup.number().required('Kategoriyani tanlash majburiy').typeError('Kategoriyani tanlang') // Qo'shildi
})