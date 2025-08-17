import { ref } from "vue";
import { useRouter } from "vue-router";
import { useVoyageManager } from "@/composables/useVoyageManager";
import type { FormDataType } from "@/types/formData";
import md5 from "md5";

export const genUtils = () => {
  const { voyageId, error } = useVoyageManager();
  const isSubmitting = ref(false);

  const formData = ref<FormDataType>({
    title: "",
    imageUrl: "",
    notes: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    startDate: new Date(),
    endDate: new Date(),
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

  // const getGravatarUrl = (email: string) => {
  //   const hash = md5(email.trim().toLowerCase());
  //   return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  // };

  const generateEmailHash = async (email: string): Promise<string> => {
    // Using the Web Crypto API for hashing
    const msgBuffer = new TextEncoder().encode(email.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest("MD5", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const getDefaultAvatarUrl = (email?: string): string => {
    if (!email) return "/default-avatar.png";
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=retro`;
  };

  return {
    formatDateForInput,
    goBack,
    handleSubmit,
    generateEmailHash,
    getDefaultAvatarUrl,
    isSubmitting,
    error,
    voyageId,
    formData,
  };
};
