<template>
  <section class="flex justify-center items-center">
    <div v-if="isLoading">
      <EditVoyageSkeleton />
    </div>
    <div v-else-if="error">
      <p>{{ error }}</p>
      <button
        @click="fetchVoyage(voyageId)"
        class="px-4 py-2 bg-accent50 text-white rounded"
      >
        Retry
      </button>
    </div>
    <main
      v-else
      class="max-w-[800px] xl:w-[600px] bg-background100 py-2 mx-auto px-3 my-5"
    >
      <div class="flex justify-between items-center mb-5">
        <h4 class="text-textblack100">Edit Voyage</h4>
        <CloseIcon
          @click="goBack"
          fillColor="textblack100"
          class="cursor-pointer"
        />
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
            <EditIcon fillColor="textblack300" size="24" />
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
            <label class="block text-textblack100 font-medium mb-1"
              >Rating</label
            >
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
            <label class="block text-textblack100 font-medium mb-1"
              >Notes</label
            >
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
  </section>
</template>

<script setup lang="ts">
import Editor from "primevue/editor";
import Rating from "primevue/rating";
import EditVoyageSkeleton from "@/components/ui/EditVoyageSkeleton.vue";
import ReusableButton from "@/components/ui/ReusableButton.vue";
import ReusableInput from "@/components/ui/ReusableInput.vue";
import EditIcon from "@/assets/icons/EditIcon.vue";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import { useVoyageManager } from "../composables/useVoyageManager";
import { useImageUpload } from "../composables/useImageUpload";
import { genUtils } from "../utils/genUtils";

const { voyageId, isLoading, fetchVoyage } = useVoyageManager();
const { goBack, handleSubmit, isSubmitting, fileInput, formData, error } =
  genUtils();

const { openFileInput, handleDrop, handleImageUpload, dragOver } =
  useImageUpload();

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};
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
