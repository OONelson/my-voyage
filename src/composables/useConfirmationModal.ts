import { ref } from "vue";

export const useConfirmationModal = () => {
  const isOpen = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const modalProps = ref<{
    title: string;
    description: string;
    confirmText: string;
    confirmColor: "red" | "green" | "blue" | "gray";
    requiresPassword: boolean;
    icon: string;
    iconType: "heroicon" | "svg";
    showBodyIcon: boolean;
  }>({
    title: "",
    description: "",
    confirmText: "Confirm",
    confirmColor: "red",
    requiresPassword: false,
    icon: "",
    iconType: "heroicon",
    showBodyIcon: false,
  });

  const openModal = (options: {
    title: string;
    description: string;
    confirmText?: string;
    confirmColor?: "red" | "green" | "blue" | "gray";
    requiresPassword?: boolean;
    icon?: string;
    iconType?: "heroicon" | "svg";
    showBodyIcon?: boolean;
  }) => {
    modalProps.value = { ...modalProps.value, ...options };
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
    isLoading.value = false;
  };

  return {
    isOpen,
    isLoading,
    modalProps,
    openModal,
    closeModal,
  };
};
