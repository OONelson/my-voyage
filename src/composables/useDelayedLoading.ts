import { ref } from "vue";

export const useDelayedLoading = (minDelayMs: number = 2000) => {
  const isPageLoading = ref(true);
  const error = ref<string | null>(null);

  const executeWithDelay = async <T>(
    action: Promise<T> | (() => Promise<T>)
  ): Promise<T> => {
    isPageLoading.value = true;
    error.value = null;

    try {
      const minLoadingTime = new Promise((resolve) =>
        setTimeout(resolve, minDelayMs)
      );
      const actionPromise = typeof action === "function" ? action() : action;

      const result = await Promise.all([minLoadingTime, actionPromise]).then(
        ([, res]) => res
      );
      return result;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unknown error occurred";
      throw err;
    } finally {
      isPageLoading.value = false;
    }
  };

  return {
    isPageLoading,
    error,
    executeWithDelay,
  };
};
