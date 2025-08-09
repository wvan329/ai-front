// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Chat from '@/views/Chat.vue'
import Hanzi from '@/views/Hanzi.vue'


const routes = [
  { path: '/', redirect: '/chat' },
  { path: '/chat', component: Chat },
  { path: '/hanzi', component: Hanzi },
]

const router = createRouter({
  history: createWebHistory('/ai/'),
  routes,
})

export default router
