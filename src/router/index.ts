import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { useAuth } from "../composables/useAuth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/auth",
      name: "login",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/voyages",
      name: "voyages",
      component: () => import("@/views/VoyagesView.vue"),
      props: true,
    },
    {
      path: "/voyages/:id",
      name: "singleVoyage",
      component: () => import("@/views/SingleVoyageView.vue"),
      props: true,
    },
    {
      path: "/start-voyage",
      name: "startVoyage",
      component: () => import("@/views/StartVoyageView.vue"),
      props: true,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
});

router.beforeEach((to, _, next) => {
  const { isAuthenticated } = useAuth();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ path: "/" });
  } else {
    next();
  }
});

export default router;
