import type { RouteRecordRaw } from "vue-router";

export interface RouteMeta {
  guestOnly?: boolean;
  requiresAuth?: boolean;
  requiresPremium?: boolean;
}

export type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: RouteMeta;
};
