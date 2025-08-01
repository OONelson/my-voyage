import { ref } from "vue";

export const UserModal = () => {
  const selectedTheme = ref("system");
  const activeTab = ref("profile");
  const showLogoutModal = ref<boolean>(false);

  const openLogoutModal = () => (showLogoutModal.value = true);

  const closeLogoutModal = () => (showLogoutModal.value = false);

  const handleLogout = () => {
    console.log("Logging out from all devices...");
    // Implement logout logic
  };

  const confirmDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      console.log("Deleting account...");
      // Implement delete logic
    }
  };
  return {
    activeTab,
    selectedTheme,
    showLogoutModal,
    handleLogout,
    openLogoutModal,
    closeLogoutModal,
    confirmDeleteAccount,
  };
};
