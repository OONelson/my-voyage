import { computed } from "vue";
import { useAuth } from "@/composables/useAuth";

export const usePlanLimits = () => {
  const { user } = useAuth();

  const isPremium = computed(() => !!user.value?.is_premium);

  const limits = computed(() => ({
    maxVoyageEntries: isPremium.value ? 50 : 10,
    maxImagesPerEntry: isPremium.value ? 8 : 1,
    maxPinnedLocations: isPremium.value ? Infinity : 2,
    canExportPdf: isPremium.value,
  }));

  const requirePremium = (onBlock?: () => void) => {
    if (!isPremium.value) {
      onBlock?.();
      return false;
    }
    return true;
  };

  return { isPremium, limits, requirePremium };
};
