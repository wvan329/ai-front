// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Chat from '@/views/Chat.vue'
import Hanzi from '@/views/Hanzi.vue'
import Test from '@/views/Test.vue'


const routes = [
  { path: '/', redirect: '/chat' },
  { path: '/chat', component: Chat },
  { path: '/hanzi', component: Hanzi },
  { path: '/test', component: Test },
]

const router = createRouter({
  history: createWebHistory('/ai/'),
  routes,
})

export default router
