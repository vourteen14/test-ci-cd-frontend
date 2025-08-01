<template>
  <div class="users container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>User</h2>
      <router-link to="/users/new" class="btn btn-success">
        Add User
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="card bg-secondary text-light">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-dark table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="users.length === 0">
                <td colspan="6" class="text-center py-4">
                  No users found
                </td>
              </tr>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.age }}</td>
                <td>{{ formatDate(user.created_at) }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <router-link 
                      :to="`/users/${user.id}/edit`" 
                      class="btn btn-outline-warning"
                    >
                      Edit
                    </router-link>
                    <button 
                      @click="showDeleteModal(user)" 
                      class="btn btn-outline-danger"
                      :disabled="deleting === user.id"
                    >
                      {{ deleting === user.id ? 'Deleting...' : 'Delete' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div 
      class="modal fade" 
      id="deleteModal" 
      tabindex="-1" 
      aria-labelledby="deleteModalLabel" 
      aria-hidden="true"
      ref="deleteModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              data-bs-dismiss="modal" 
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete <strong>{{ userToDelete?.name }}</strong>?
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
              :disabled="deleting"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-danger"
              @click="confirmDelete"
              :disabled="deleting"
            >
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
              {{ deleting ? 'Deleting...' : 'Delete User' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
import { Modal } from 'bootstrap'

export default {
  name: 'Users',
  data() {
    return {
      users: [],
      loading: true,
      deleting: null,
      userToDelete: null,
      deleteModalInstance: null
    }
  },
  async created() {
    await this.loadUsers()
  },
  mounted() {
    this.deleteModalInstance = new Modal(this.$refs.deleteModal)
  },
  methods: {
    async loadUsers() {
      try {
        this.loading = true
        const response = await api.getUsers()
        this.users = response.data.data
      } catch (error) {
        console.error('Failed to load users:', error)
        this.$toast?.error('Failed to load users') // Optional if pakai toast
      } finally {
        this.loading = false
      }
    },
    showDeleteModal(user) {
      this.userToDelete = user
      this.deleteModalInstance.show()
    },
    async confirmDelete() {
      if (!this.userToDelete) return
      try {
        this.deleting = this.userToDelete.id
        await api.deleteUser(this.userToDelete.id)
        this.users = this.users.filter(u => u.id !== this.userToDelete.id)
        this.$toast?.success(`User "${this.userToDelete.name}" deleted successfully`)
        this.deleteModalInstance.hide()
      } catch (error) {
        console.error('Failed to delete user:', error)
        this.$toast?.error('Failed to delete user')
      } finally {
        this.deleting = null
        this.userToDelete = null
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString()
    }
  }
}
</script>