<template>
  <section class="flex justify-center items-center">
    <div v-if="isLoading">
      <EditVoyageSkeleton />
    </div>
    <main v-else class="bg-background100 py-2 mx-auto px-3 my-5">
      <div class="flex justify-between items-center mb-5">
        <h4 class="text-textblack100">Create New Voyage</h4>
        <CloseIcon
          @click="navigateToVoyages"
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

          <!-- Action Buttons -->
          <div v-if="formData.imageUrl" class="flex gap-2 mb-2">
            <button
              @click="cropImage"
              class="px-4 py-2 bg-accent50 text-white rounded-md hover:bg-accent70 transition-colors"
            >
              Crop Image
            </button>
            <button
              @click="rotate(-90)"
              class="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              ↺ Rotate Left
            </button>
            <button
              @click="rotate(90)"
              class="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              ↻ Rotate Right
            </button>
          </div>

          <!-- Main Image Container -->
          <div
            class="h-64 bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden"
            :class="{
              'border-2 border-dashed border-accent50': !formData.imageUrl,
              'border border-gray-200': formData.imageUrl,
            }"
            @click="openFileInput"
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            @drop.prevent="handleDrop"
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

            <!-- Source Image (hidden when cropped) -->
            <img
              v-if="formData.imageUrl && !croppedImage"
              ref="image"
              :src="formData.imageUrl"
              :style="imageStyle"
              @load="initCropper"
              class="max-w-full max-h-full object-contain"
            />

            <!-- Crop Box -->
            <div
              v-if="formData.imageUrl && !croppedImage && !isImgLoading"
              ref="cropBox"
              class="absolute border-2 border-white border-dashed shadow-lg"
              :style="cropBoxStyle"
              @mousedown="startDrag"
            >
              <div
                v-for="handle in handles"
                :key="handle"
                class="absolute w-3 h-3 bg-white border border-accent50 rounded-full"
                :class="handleClasses[handle]"
                @mousedown.stop="startResize($event, handle)"
              />
            </div>

            <!-- Cropped Preview -->
            <img
              v-if="croppedImage"
              :src="croppedImage"
              class="w-full h-full object-cover"
            />

            <!-- Empty State -->
            <template v-if="!formData.imageUrl && !isImgLoading && !dragOver">
              <div class="flex flex-col items-center text-gray-400">
                <EditIcon class="w-6 h-6 mb-2" />
                <span>Drag & drop or click to upload</span>
              </div>
            </template>

            <!-- Edit Overlay -->
            <div
              v-if="formData.imageUrl && !isImgLoading && !croppedImage"
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 cursor-pointer"
              @click.stop="openFileInput"
            >
              <EditIcon
                class="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity"
              />
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
import Spinner from "@/components/ui/Spinner.vue";
import EditIcon from "@/assets/icons/EditIcon.vue";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import { useImageUpload } from "../composables/useImageUpload";
import { useVoyageManager } from "../composables/useVoyageManager";
import { genUtils } from "../utils/genUtils";
// import { AdvancedCropper } from "vue-advanced-cropper";
// import "vue-advanced-cropper/dist/style.css";

const { isLoading, navigateToVoyages } = useVoyageManager();
const { goBack, handleSubmit, isSubmitting, formData } = genUtils();

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
  handles, // Make sure handles is typed as HandleKey[]
  imageStyle,
  cropBoxStyle,
  cropBox,
  croppedImage,
  dragOver,
  fileInput,
  isImgLoading,
} = useImageUpload();

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

// Add handleClasses mapping for crop handles
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
