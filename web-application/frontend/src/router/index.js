import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import UserForm from '../views/UserForm.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home - Web Application' }
  },
  {
    path: '/users',
    name: 'Users',
    component: User,
    meta: { title: 'User List - Web Application' }
  },
  {
    path: '/users/new',
    name: 'CreateUser',
    component: UserForm,
    meta: { title: 'Create User - Web Application' }
  },
  {
    path: '/users/:id/edit',
    name: 'EditUser',
    component: UserForm,
    props: true,
    meta: { title: 'Edit User - Web Application' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router