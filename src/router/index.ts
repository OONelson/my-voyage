import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/voyages",
      name: "voyages",
      component: () => import("../views/VoyagesView.vue"),
      props: true,
    },
    {
      path: "/voyages/:id",
      name: "singleVoyage",
      component: () => import("../views/SingleVoyageView.vue"),
      props: true,
    },
    {
      path: "/start-voyage",
      name: "startVoyage",
      component: () => import("../views/StartVoyageView.vue"),
      props: true,
    },
  ],
});

export default router;
