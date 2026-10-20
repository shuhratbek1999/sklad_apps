import api from './api'

export const authService = {
  async login(credentials) {
    // credentials = { login: '...', password: '...' }
    return await api.post('/auth/login', credentials)
  },
  
  async getMe() {
    return await api.get('/auth/me')
  },
async updateProfile(profileData) {
    return await api.put('/auth/update-profile', profileData)
  }
}