import { computed } from "vue";

interface NavItem {
  name: string;
  path: string;
  icon?: string;
}

export const NavPaths = computed<NavItem[]>(() => [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
]);
