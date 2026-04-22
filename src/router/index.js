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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      component: () => import('../layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          redirect: '/dashboard/analytics',
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('../views/AnalyticsView.vue'),
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('../views/ProductsView.vue'),
        },
        {
          path: 'products/new',
          name: 'productNew',
          component: () => import('../views/ProductFormView.vue'),
        },
        {
          path: 'products/:id',
          name: 'productDetail',
          component: () => import('../views/ProductDetailView.vue'),
        },
        {
          path: 'products/:id/edit',
          name: 'productEdit',
          component: () => import('../views/ProductFormView.vue'),
        },
        {
          path: 'sales',
          name: 'sales',
          component: () => import('../views/SalesView.vue'),
        },
        {
          path: 'cashiers',
          name: 'cashiers',
          component: () => import('../views/CashiersView.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('refreshToken')

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!isAuthenticated) {
      next({ name: 'login' })
      return
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    // this route requires guest (no auth), check if logged in
    // if logged in, redirect to dashboard.
    if (isAuthenticated) {
      next({ name: 'dashboard' })
      return
    }
  }

  // otherwise proceed
  next()
})

export default router
