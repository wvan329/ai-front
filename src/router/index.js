// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Chat from '@/views/Chat.vue'


const routes = [
  { path: '/', redirect: '/chat' },
  { path: '/chat', component: Chat },
]

const router = createRouter({
  history: createWebHistory('/ai/'),
  routes,
})

export default router
