import { ref } from "vue";
import { useRouter } from "vue-router";
import { useVoyageManager } from "../composables/useVoyageManager";
import { useImageUpload } from "../composables/useImageUpload";

export const genUtils = () => {
  const { voyageId, error } = useVoyageManager();
  const { imageUrl } = useImageUpload();
  const isSubmitting = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  // Form data with proper types
  const formData = ref({
    title: "",
    imageUrl: imageUrl,
    notes: "",
    location: "",
    date: "",
    rating: 0,
  });

  const router = useRouter();

  const formatDateForInput = (date: Date | string) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const goBack = () => {
    router.go(-1);
  };

  const handleSubmit = async () => {
    isSubmitting.value = true;
    try {
      // In a real app, you would call an API here
      console.log("Updating voyage:", {
        id: voyageId,
        ...formData.value,
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect back to voyage details after successful update
      router.push({
        path: `/voyages/${voyageId}`,
        query: {
          updated: "true",
        },
      });
    } catch (err) {
      console.error("Error updating voyage:", err);
      error.value =
        err instanceof Error ? err.message : "Failed to update voyage";
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    formatDateForInput,
    goBack,
    handleSubmit,
    isSubmitting,
    fileInput,
    formData,
    error,
    voyageId,
  };
};
