import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { deleteUserAccount } from "@/services/supabase/auth";

const { handleLogout } = useAuth();

export const UserModal = () => {
  const selectedTheme = ref("system");
  const activeTab = ref("profile");
  const showLogoutModal = ref<boolean>(false);

  const openLogoutModal = () => (showLogoutModal.value = true);

  const closeLogoutModal = () => (showLogoutModal.value = false);

  const confirmLogout = () => {
    console.log("Logging out from all devices...");
    handleLogout();
  };

  const confirmDeleteAccount = (userId: string) => {
    deleteUserAccount(userId);
  };
  return {
    activeTab,
    selectedTheme,
    showLogoutModal,
    confirmLogout,
    openLogoutModal,
    closeLogoutModal,
    confirmDeleteAccount,
  };
};
