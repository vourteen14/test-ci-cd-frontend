<template>
  <div class="user-form">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card bg-secondary">
          <div class="card-header">
            <h3>{{ isEditing ? 'Edit User' : 'Add New User' }}</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-control bg-dark text-light border-secondary"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-control bg-dark text-light border-secondary"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="age" class="form-label">Age</label>
                <input
                  id="age"
                  v-model.number="form.age"
                  type="number"
                  class="form-control bg-dark text-light border-secondary"
                  min="0"
                  max="120"
                  required
                >
              </div>
              
              <div class="d-flex justify-content-between">
                <router-link to="/users" class="btn btn-secondary">
                  Cancel
                </router-link>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="submitting"
                >
                  {{ submitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'UserForm',
  
  props: {
    id: String
  },
  
  data() {
    return {
      form: {
        name: '',
        email: '',
        age: ''
      },
      submitting: false
    }
  },
  
  computed: {
    isEditing() {
      return !!this.id
    }
  },
  
  async created() {
    if (this.isEditing) {
      this.loadUser()
    }
  },
  
  methods: {
    async loadUser() {
      try {
        const response = await api.getUser(this.id)
        const user = response.data.data
        this.form = {
          name: user.name,
          email: user.email,
          age: user.age
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        this.$toast.error('Failed to load user')
        this.$router.push('/users')
      }
    },
    
    async handleSubmit() {
      try {
        this.submitting = true
        
        if (this.isEditing) {
          await api.updateUser(this.id, this.form)
          this.$toast.success('User updated successfully')
        } else {
          await api.createUser(this.form)
          this.$toast.success('User created successfully')
        }
        
        this.$router.push('/users')
      } catch (error) {
        console.error('Failed to save user:', error)
        const message = error.response?.data?.error || 'Failed to save user'
        this.$toast.error(message)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>