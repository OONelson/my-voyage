import type { AppRouteRecordRaw } from "@/types/router";
import { setupRouter } from "@/router/guards";

import HomeView from "@/views/HomeView.vue";

const routes: AppRouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { guestOnly: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/views/SignupView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/auth/confirm",
    name: "confirm-email",
    component: () => import("@/views/ConfirmEmail.vue"),
    meta: { guestOnly: true },
  },
  {
    path: "/auth/callback",
    name: "auth-callback",
    component: () => import("@/views/AuthCallBackView.vue"),
  },
  {
    path: "/voyages",
    name: "voyages",
    component: () => import("@/views/VoyagesView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/voyages/:id",
    name: "singleVoyage",
    component: () => import("@/views/SingleVoyageView.vue"),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/voyages/:id/edit",
    name: "editVoyage",
    component: () => import("@/views/EditVoyageView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/voyages/create",
    name: "CreateVoyage",
    component: () => import("@/views/CreateVoyage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/voyages/favourites",
    name: "FavouritesVoyage",
    component: () => import("@/views/FavouriteVoyages.vue"),
    meta: { requiresAuth: true, requiresPremium: true },
  },
  {
    path: "/pricing",
    name: "pricing",
    component: () => import("@/views/PricingView.vue"),
  },
  {
    path: "/payment/success",
    name: "PaymentSuccess",
    component: () => import("@/views/PaymentSuccess.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/views/NotFoundView.vue"),
  },
];

export const router = setupRouter(routes);
