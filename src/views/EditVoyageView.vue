<template>
  <div v-if="isPageLoading">
    <EditVoyageSkeleton />
  </div>
  <div v-else-if="error">
    <p>{{ error }}</p>
    <button
      @click="loadVoyageData"
      class="px-4 py-2 bg-accent50 text-white rounded"
    >
      Retry
    </button>
  </div>
  <main v-else class="max-w-[800px] bg-background100 py-2 mx-auto px-3">
    <div class="flex justify-between items-center mb-5">
      <h4 class="text-textblack100">Edit Voyage</h4>
      <CloseIcon @click="goBack" />
    </div>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Image Section -->
      <div class="space-y-2 relative">
        <input
          type="file"
          @change="handleImageUpload"
          accept="image/*"
          class="hidden"
          ref="fileInput"
        />
        <EditIcon
          fillColor="textblack300"
          size="30"
          @click="openFileInput"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <img
          v-if="formData.imageUrl"
          :src="formData.imageUrl"
          @click="openFileInput"
          class="rounded-md w-full h-48 object-cover border opacity-60"
        />
        <div
          v-else
          class="h-48 bg-gray-100 rounded-md flex items-center justify-center"
          @click="openFileInput"
        >
          <span class="text-textblack50">No image selected</span>
        </div>
      </div>

      <!-- Title -->
      <div>
        <ReusableInput label="Title" type="text" v-model="formData.title" />
        <ReusableInput
          label="Location"
          type="text"
          v-model="formData.location"
        />
        <ReusableInput label="Date" type="date" v-model="formData.date" />

        <!-- Rating -->
        <div>
          <label class="block text-textblack100 font-medium mb-1">Rating</label>
          <div class="flex space-x-1">
            <div class="flex justify-center">
              <Rating
                v-model="formData.rating"
                :stars="5"
                class="custom-rating"
              />
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="py-3">
          <label class="block text-textblack100 font-medium mb-1">Notes</label>
          <div class="border bg-white">
            <Editor
              v-model="formData.notes"
              editorStyle="height: 220px"
              :modules="modules"
            />
          </div>
        </div>
      </div>
      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 pt-4">
        <router-link
          :to="`/voyages/${voyageId}`"
          class="px-4 py-2 border rounded text-textblack100 hover:bg-gray-100"
        >
          Cancel
        </router-link>
        <ReusableButton
          type="submit"
          class="px-4 py-2 bg-accent50 text-white rounded hover:bg-accent70"
          :disabled="isSubmitting"
          :label="isSubmitting ? 'Saving...' : 'Save Changes'"
        />
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Editor from "primevue/editor";
import Rating from "primevue/rating";
import EditVoyageSkeleton from "@/components/ui/EditVoyageSkeleton.vue";
import ReusableButton from "@/components/ui/ReusableButton.vue";
import ReusableInput from "@/components/ui/ReusableInput.vue";
import EditIcon from "@/assets/icons/EditIcon.vue";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import { Voyages } from "../constants/constant";
import type { VoyageTypeInfo } from "../types/Voyage";
import { useDelayedLoading } from "../composables/useDelayedLoading.ts";

const route = useRoute();
const router = useRouter();
const voyageId = parseInt(route.params.id as string);

const { isPageLoading, error, executeWithDelay } = useDelayedLoading();
const isSubmitting = ref(false);

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

// File input ref for type safety
const fileInput = ref<HTMLInputElement | null>(null);

// Form data with proper types
const formData = ref({
  title: "",
  imageUrl: "",
  notes: "",
  location: "",
  date: "",
  rating: 3,
});

const openFileInput = () => {
  fileInput.value?.click();
};

const loadVoyageData = async () => {
  try {
    // First try to get from route meta (if set by navigation guards or previous page)
    if (
      route.meta?.voyage &&
      typeof route.meta.voyage === "object" &&
      "id" in route.meta.voyage
    ) {
      populateForm(route.meta.voyage as VoyageTypeInfo);
      return;
    }

    // Then try to get from route params
    if (route.params.voyages) {
      const voyages = Array.isArray(route.params.voyages)
        ? route.params.voyages
        : JSON.parse(route.params.voyages as string);

      const voyage = voyages.find((v: VoyageTypeInfo) => v.id === voyageId);
      if (voyage) {
        populateForm(voyage);
        return;
      }
    }

    // Fallback to checking in constants
    const voyage = Voyages.find((v) => v.id === voyageId);
    if (voyage) {
      populateForm(voyage);
    } else {
      throw new Error("Voyage not found");
    }
  } catch (err) {
    console.error("Error loading voyage:", err);
    error.value = err instanceof Error ? err.message : "Failed to load voyage";
    throw err;
  }
};

const populateForm = (voyage: VoyageTypeInfo) => {
  formData.value = {
    title: voyage.title,
    imageUrl: voyage.imageUrl || "",
    notes: voyage.notes || "",
    location: voyage.location,
    date: formatDateForInput(voyage.date),
    rating: voyage.rating,
  };
};

const formatDateForInput = (date: Date | string) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

// Navigate to the previous page
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

const handleImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    // In a real app, you would upload to a server
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.imageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};
onMounted(async () => {
  await executeWithDelay(loadVoyageData());
});
</script>

<style scoped>
/* Custom styling for the rating stars */
:deep(.custom-rating .p-rating-icon) {
  color: #fbbf24; /* Default gray color */
  transition: color 0.2s;
}

:deep(.custom-rating .p-rating-icon.p-rating-icon-active) {
  color: #fbbf24; /* Yellow color for active stars */
}

:deep(.custom-rating .p-rating-icon:hover) {
  color: #fbbf24; /* Yellow color on hover */
}
</style>
