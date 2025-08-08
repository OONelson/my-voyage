import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";
import type { AppRouteRecordRaw } from "../types/router";

export function setupRouter(routes: AppRouteRecordRaw[]) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach(async (to) => {
    const { checkAuth, user } = useAuth();
    const isAuthenticated = await checkAuth();

    if (to.meta.requiresAuth && !isAuthenticated) {
      return "/login";
    }

    if (to.meta.requiresPremium && !user.value?.is_premium) {
      return "/pricing";
    }

    if ((to.path === "/login" || to.path === "/signup") && isAuthenticated) {
      return "/voyages";
    }
  });

  return router;
}
