import { ref } from "vue";
import { useRouter } from "vue-router";
import { useVoyageManager } from "@/composables/useVoyageManager";

export const genUtils = () => {
  const router = useRouter();
  const { voyageId, error } = useVoyageManager();
  const isSubmitting = ref(false);

  const formatDateForInput = (date: Date | string) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const goBack = () => {
    router.go(-1);
  };
  const upgradeToPremium = () => {
    router.push("/pricing");
  };

  return {
    formatDateForInput,
    goBack,
    upgradeToPremium,
    isSubmitting,
    error,
    voyageId,
  };
};
