<template>
  <UButton color="gray" variant="ghost" @click="confirmLogout">
    <LogoutIcon />
    Logout
  </UButton>

  <ConfirmationModal
    v-model:open="modal.isOpen"
    v-model:loading="modal.isLoading"
    :icon="modal.modalProps.value.icon"
    :title="modal.modalProps.value.title"
    :description="modal.modalProps.value.description"
    :confirm-text="modal.modalProps.value.confirmText"
    :confirm-color="modal.modalProps.value.confirmColor"
    icon="LogoutIcon"
    icon-type="svg"
    @confirm="handleLogout"
    @close="modal.closeModal"
  />
</template>

<script setup lang="ts">
import LogoutIcon from "@/assets/icons/LogOutIcon.vue";
import { useAuth } from "@/composables/useAuth";
import { useConfirmationModal } from "@/composables/useConfirmationModal";

const { handleLogout: authLogout } = useAuth();
const modal = useConfirmationModal();

const confirmLogout = () => {
  modal.openModal({
    icon: "LogOutIcon",
    iconType: "svg",
    title: "Logout",
    description: "Are you sure you want to logout?",
    confirmText: "Logout",
    confirmColor: "green",
  });
};

const handleLogout = async () => {
  modal.isLoading = true;

  try {
    await authLogout();
    // Optional: redirect or show success message
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    modal.closeModal();
  }
};
</script>
