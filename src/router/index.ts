import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import SearchPage from '../views/SearchPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Search Page',
    component: SearchPage,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
