import { ref } from "vue";
import { checkPremiumStatus, upgradeToPremium } from "@/services/premium";

export function usePremium(userId: string) {
  const isPremium = ref(false);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const checkStatus = async () => {
    loading.value = true;
    try {
      isPremium.value = await checkPremiumStatus(userId);
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  const upgradeUser = async () => {
    loading.value = true;
    try {
      await upgradeToPremium(userId);
      isPremium.value = true;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  return {
    isPremium,
    loading,
    error,
    checkStatus,
    upgradeUser,
  };
}
