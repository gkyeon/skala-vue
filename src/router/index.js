import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/cafe/:menuId',
      name: 'cafeMenuDetail',
      component: () => import('../views/CafeMenuDetailView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'weatherDetail',
      component: () => import('../views/CityWeatherDetailView.vue'),
    },
    {
      path: '/practices',
      name: 'practices',
      component: () => import('../views/PracticesArchiveView.vue'),
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
