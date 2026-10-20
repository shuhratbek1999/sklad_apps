import { defineStore } from 'pinia'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
  }),

  actions: {
    async login(loginData) {
      this.loading = true
      this.error = null
      try {
        const data = await authService.login(loginData)
        const { token, user } = data

        this.user = user
        localStorage.setItem('tokenSklad', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return true
      } catch (err) {
        this.error = err.message || 'Login yoki parol xato'
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('tokenSklad')
      localStorage.removeItem('user')
      window.location.href = '/login'
    },
    async updateProfile(profileData) {
    this.loading = true
    this.error = null
    try {
      const response = await authService.updateProfile(profileData)
      
      if (response.success) {
        this.user = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
        return true
      }
    } catch (err) {
      this.error = err.message || 'Profilni yangilashda xatolik'
      return false
    } finally {
      this.loading = false
    }
  }
  }
})