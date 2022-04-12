import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashboard from '../views/Dashboard.vue'
import Photo from '../views/Photo.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home-home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'Dash-board',
    component: Dashboard
  },
  {
    path: '/photo',
    name: 'photo',
    component: Photo
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router