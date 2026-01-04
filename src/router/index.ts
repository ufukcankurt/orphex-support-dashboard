import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/request/:id',
    name: 'RequestDetail',
    component: () => import('../views/RequestDetailView.vue'),
    props: (route) => ({ id: Number(route.params.id) }),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.path === from.path) {
      return {};
    }

    return { top: 0 };
  },
});

export default router;
