import { computed, ref } from "vue";
import type { UserProfile } from "@/types/user";

export const userData = ref<UserProfile>({
  id: "1",
  name: "nelson",
  email: "nelson@gmail.com",
  profileImage: "https://github.com/benjamincanac.png",
  is_premium: false,
  createdAt: new Date(),
});

export const maskedEmail = computed(() => {
  const [username, domain] = userData.value.email.split("@");
  return `${username.substring(0, 2)}****${username.slice(-1)}@${domain}`;
});

export const themeItems = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const tabs = [
  { id: "general", label: "General" },
  { id: "profile", label: "Profile" },
  { id: "about", label: "About" },
];
