import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue')
    },
    {
      path: '/',
      component: () => import('@/layout/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { title: '统计分析' }
        },
        {
          path: 'buildings',
          name: 'buildings',
          component: () => import('@/views/BuildingList.vue'),
          meta: { title: '建筑管理' }
        },
        {
          path: 'devices',
          name: 'devices',
          component: () => import('@/views/DeviceList.vue'),
          meta: { title: '设备管理' }
        },
        {
          path: 'realtime',
          name: 'realtime',
          component: () => import('@/views/RealtimeData.vue'),
          meta: { title: '实时监控' }
        },
        {
          path: 'alerts',
          name: 'alerts',
          component: () => import('@/views/AlertList.vue'),
          meta: { title: '告警记录' }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const whiteList = ['/login', '/register']
  
  if (!whiteList.includes(to.path) && !userStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
