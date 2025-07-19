<template>
  <section class="flex justify-center items-center">
    <div v-if="isLoading">
      <EditVoyageSkeleton />
    </div>
    <main v-else class="bg-background100 py-2 mx-auto px-3 my-5">
      <div class="flex justify-between items-center mb-5">
        <h4 class="text-textblack100">Create New Voyage</h4>
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

          <div
            class="h-48 bg-gray-100 rounded-md flex items-center justify-center gap-2 relative"
            :class="{
              'border-2 border-accent50 border-dashed': !formData.imageUrl,
              'border opacity-60': formData.imageUrl && !isImgLoading,
            }"
            @click="openFileInput"
            @dragover.prevent="handleDragOver"
            @dragleave="handleDragLeave"
            @drop.prevent="handleDrop"
          >
            <div
              v-if="isImgLoading"
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-md z-10"
            >
              <div
                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent50"
              ></div>
            </div>

            <!-- Drag overlay state -->
            <div
              v-if="dragOver && !isImgLoading"
              class="absolute inset-0 bg-accent50 bg-opacity-20 flex items-center justify-center border-2 border-accent50 border-dashed rounded-md"
            >
              <span class="text-accent50 font-medium">Drop image here</span>
            </div>

            <!-- Image preview -->
            <img
              v-if="formData.imageUrl && !isImgLoading"
              :src="formData.imageUrl"
              class="rounded-md w-full h-full object-cover"
            />

            <!-- Empty state -->
            <template v-if="!formData.imageUrl && !isImgLoading && !dragOver">
              <span class="text-textblack50"
                >Drag & drop or click to upload</span
              >
              <EditIcon fillColor="textblack300" size="24" />
            </template>

            <!-- Edit overlay (shown when image exists) -->
            <div
              v-if="formData.imageUrl && !isImgLoading"
              class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md"
            >
              <img
                v-if="formData.imageUrl && !isImgLoading"
                :src="formData.imageUrl"
                class="rounded-md w-full h-full object-cover"
              />
              <EditIcon fillColor="white" size="30" class="opacity-90" />
            </div>
          </div>
        </div>

        <!-- Title -->
        <div>
          <ReusableInput
            label="Title"
            type="text"
            v-model="formData.title"
            placeholder="A weekend in Monaco"
            required
          />
          <ReusableInput
            label="Location"
            type="text"
            v-model="formData.location"
            placeholder="Monaco"
            required
          />
          <ReusableInput
            label="Date"
            type="date"
            v-model="formData.date"
            required
          />

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
          <button
            @click="goBack"
            class="px-4 py-2 border rounded text-textblack100 hover:bg-gray-100"
          >
            Cancel
          </button>
          <ReusableButton
            type="submit"
            class="px-4 py-2 bg-accent50 text-white rounded hover:bg-accent70"
            :disabled="isSubmitting"
            :label="isSubmitting ? 'Creating...' : 'Create Voyage'"
          />
        </div>
      </form>
    </main>
  </section>
</template>

<script setup lang="ts">
import Editor from "primevue/editor";
import Rating from "primevue/rating";
import ReusableButton from "@/components/ui/ReusableButton.vue";
import ReusableInput from "@/components/ui/ReusableInput.vue";
import EditIcon from "@/assets/icons/EditIcon.vue";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import { useImageUpload } from "../composables/useImageUpload";
import { useVoyageManager } from "../composables/useVoyageManager";
import { genUtils } from "../utils/genUtils";

const { isLoading } = useVoyageManager();
const { goBack, handleSubmit, isSubmitting, formData } = genUtils();

const {
  fileInput,
  dragOver,
  isImgLoading,
  openFileInput,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleImageUpload,
} = useImageUpload();

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};
</script>

<style scoped>
:deep(.custom-rating .p-rating-icon) {
  color: #fbbf24;
  transition: color 0.2s;
}

:deep(.custom-rating .p-rating-icon.p-rating-icon-active) {
  color: #fbbf24;
}

:deep(.custom-rating .p-rating-icon:hover) {
  color: #fbbf24;
}
</style>
