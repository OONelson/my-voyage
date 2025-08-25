<template>
  <UButton color="red" variant="outline" @click="confirmDelete">
    <DangerIcon class="w-4 h-4 mr-2" />
    Delete Account
  </UButton>

  <ConfirmationModal
    v-model:open="modal.isOpen"
    v-model:loading="modal.isLoading"
    :title="modal.modalProps.value.title"
    :description="modal.modalProps.value.description"
    :confirm-text="modal.modalProps.value.confirmText"
    :confirm-color="modal.modalProps.value.confirmColor"
    :requires-password="modal.modalProps.value.requiresPassword"
    icon="DangerIcon"
    icon-type="svg"
    show-body-icon
    @confirm="confirmDeleteAccount"
    @close="modal.closeModal"
  />
</template>

<script setup lang="ts">
import DangerIcon from "@/assets/icons/DangerIcon.vue";
import { useConfirmationModal } from "@/composables/useConfirmationModal";
import { UserModal } from "@/utils/userModal";

const { confirmDeleteAccount } = UserModal();
const modal = useConfirmationModal();

const confirmDelete = () => {
  modal.openModal({
    title: "Delete Account",
    description:
      "This action cannot be undone. All your data will be permanently deleted.",
    confirmText: "Delete Forever",
    confirmColor: "red",
    requiresPassword: true,
    icon: "IconDanger",
    iconType: "svg",
    showBodyIcon: true,
  });
};
</script>
