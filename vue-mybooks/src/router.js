import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ProfileView from './views/ProfileView.vue'
import RecommendationsView from './views/RecommendationsView.vue'
import AuthorsView from './views/AuthorsView.vue'
import TopicsView from './views/TopicsView.vue'
import MyBooksView from './views/MyBooksView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/profile', name: 'profile', component: ProfileView },
  { path: '/recommendations', name: 'recommendations', component: RecommendationsView },
  { path: '/authors', name: 'authors', component: AuthorsView },
  { path: '/topics', name: 'topics', component: TopicsView },
  { path: '/mybooks', name: 'mybooks', component: MyBooksView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router