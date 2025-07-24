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
          <div v-if="showActionButtons" class="flex gap-2 mb-2">
            <button
              @click="cropImage"
              class="flex md:justify-between items-center gap-1 px-2 bg-accent50 text-white rounded-md hover:bg-accent70 transition-colors"
            >
              <CropIcon size="24" fillColor="#fff" />
              <span class="hidden md:block"> Crop </span>
            </button>
            <button
              @click="rotate(-90)"
              class="flex md:justify-between items-center gap-1 px-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <RotateLeft size="24" />

              <span class="hidden md:block"> Rotate Left </span>
            </button>
            <button
              @click="rotate(90)"
              class="flex md:justify-between items-center gap-1 px-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <RotateRight size="24" />
              <span class="hidden md:block"> Rotate Right </span>
            </button>
            <div
              v-if="hasImage"
              @click.prevent="deleteSelectedImage"
              class="px-4 py-2 bg-red-600 rounded-md hover:bg-red-500 transition-colors cursor-pointer"
            >
              <TrashIcon fillColor="#fff" size="24" />
            </div>
          </div>

      <!-- Main Image Container -->
      <div
            class="h-64 bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden"
            :class="{
              'border-2 border-dashed border-accent50': !hasImage,
              'border border-gray-200': hasImage,
            }"
            @dragover.prevent="handleDragOver"
            @dragleave="handleDragLeave"
            @drop.prevent="handleDrop"
            v-if="true"
            v-bind="!hasImage ? { onClick: openFileInput } : {}"
          >
            <!-- Loading State -->
            <div
              v-if="isImgLoading"
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-20"
            >
              <Spinner class="w-8 h-8 text-accent50" />
            </div>

            <!-- Drag Overlay -->
            <div
              v-if="dragOver && !isImgLoading"
              class="absolute inset-0 flex items-center justify-center bg-accent50 bg-opacity-10 border-2 border-dashed border-accent50 z-10"
            >
              <div class="bg-white px-4 py-2 rounded-lg shadow-sm">
                <span class="text-accent50 font-medium">Drop image here</span>
              </div>
            </div>

            <!-- Original Image Preview -->
            <img
              v-if="showOriginalImage"
              :src="formData.imageUrl"
              ref="image"
              :style="imageStyle"
              @load="initCropper"
              class="max-w-full max-h-full object-contain"
            />

            <!-- Crop Box (only visible when editing original) -->
            <div
              v-if="showCropBox"
              ref="cropBox"
              class="absolute border-2 border-[#3bc159] border-dashed shadow-lg"
              :style="cropBoxStyle"
              @mousedown="startDrag"
            >
              <div
                v-for="handle in typedHandles"
                :key="handle"
                class="absolute w-3 h-3 bg-white border border-accent50 rounded-full"
                :class="handleClasses[handle]"
                @mousedown.stop="startResize($event, handle)"
              />
            </div>

            <!-- Cropped Preview -->
            <img
              v-if="showCroppedImage"
              :src="croppedImage"
              class="w-full h-full object-cover"
            />

            <!-- Empty State -->
            <template v-if="showEmptyState">
              <div class="flex flex-col items-center text-gray-400">
                <EditIcon class="w-6 h-6 mb-2" />
                <span>Drag & drop or click to upload</span>
              </div>
            </template>
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
import Spinner from "@/components/ui/Spinner.vue";

import EditIcon from "@/assets/icons/EditIcon.vue";
import CloseIcon from "@/assets/icons/CloseIcon.vue";

import { useVoyageManager } from "../composables/useVoyageManager";
import { useImageUpload } from "../composables/useImageUpload";
import { genUtils } from "../utils/genUtils";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const { voyageId, isLoading, fetchVoyage } = useVoyageManager();
const { goBack, handleSubmit ,
  isSubmitting, formData, error } = genUtils();

const {
  rotate,
  initCropper,
  startDrag,
  startResize,
  cropImage,
  handleDrop,
  openFileInput,
  handleImageUpload,
  handleDragOver,
  handleDragLeave,
  deleteSelectedImage,
  handles,
  imageStyle,
  cropBoxStyle,
  cropBox,
  croppedImage,
  dragOver,
  fileInput,
  isImgLoading,
} = useImageUpload(formData);

// Ensure handles is typed as HandleKey[]
const typedHandles = handles as HandleKey[];

const hasImage = computed(
  () => !!formData.value.imageUrl || !!croppedImage.value
);
const showActionButtons = computed(
  () => formData.value.imageUrl && !isImgLoading.value
);
const showOriginalImage = computed(
  () => formData.value.imageUrl && !croppedImage.value && !isImgLoading.value
);
const showCropBox = computed(
  () => formData.value.imageUrl && !croppedImage.value && !isImgLoading.value
);
const showCroppedImage = computed(
  () => !!croppedImage.value && !isImgLoading.value
);
const showEmptyState = computed(
  () =>
    !formData.value.imageUrl &&
    !croppedImage.value &&
    !isImgLoading.value &&
    !dragOver.value
);
const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

type HandleKey =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right";

const handleClasses: Record<HandleKey, string> = {
  "top-left": "top-0 left-0 cursor-nwse-resize",
  "top-right": "top-0 right-0 cursor-nesw-resize",
  "bottom-left": "bottom-0 left-0 cursor-nesw-resize",
  "bottom-right": "bottom-0 right-0 cursor-nwse-resize",
  top: "top-0 left-1/2 -translate-x-1/2 cursor-ns-resize",
  bottom: "bottom-0 left-1/2 -translate-x-1/2 cursor-ns-resize",
  left: "left-0 top-1/2 -translate-y-1/2 cursor-ew-resize",
  right: "right-0 top-1/2 -translate-y-1/2 cursor-ew-resize",
};

onMounted(async () => {
  const voyage = await fetchVoyage(Number(route.params.id));
  if (voyage) {
    formData.value = {
      imageUrl: voyage.imageUrl || "",
      title: voyage.title,
      location: voyage.location,
      date: voyage.date,
      rating: voyage.rating,
      notes: voyage.notes,
    };
  }
});
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
