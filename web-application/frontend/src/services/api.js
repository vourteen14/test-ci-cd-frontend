import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://127.0.0.1:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  getUsers() {
    return api.get('/users')
  },
  
  getUser(id) {
    return api.get(`/users/${id}`)
  },
  
  createUser(userData) {
    return api.post('/users', userData)
  },
  
  updateUser(id, userData) {
    return api.put(`/users/${id}`, userData)
  },
  
  deleteUser(id) {
    return api.delete(`/users/${id}`)
  }
}