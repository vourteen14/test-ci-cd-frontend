import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import UserForm from '../views/UserForm.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/users',
    name: 'Users',
    component: User
  },
  {
    path: '/users/new',
    name: 'CreateUser',
    component: UserForm
  },
  {
    path: '/users/:id/edit',
    name: 'EditUser',
    component: UserForm,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router