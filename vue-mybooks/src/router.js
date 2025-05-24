import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ProfileView from './views/ProfileView.vue'
import RecommendationsView from './views/RecommendationsView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/profile', name: 'profile', component: ProfileView },
  { path: '/recommendations', name: 'recommendations', component: RecommendationsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router