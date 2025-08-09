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
            ref="fileInput"
            @change="handleImageUpload"
            accept="image/*"
            class="hidden"
          />

          <!-- Action Buttons -->
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
        </div>

        <!-- Title -->
        <div>
          <ReusableInput
            label="Title"
            type="text"
            v-model="formData.title"
            placeholder="A weekend in Monaco"
          />

          <div class="space-y-2">
            <label class="block text-textblack100 font-medium">Location</label>

            <div class="flex gap-3">
              <div class="flex-1 relative">
                <input
                  type="text"
                  v-model="locationSearch"
                  @input="searchLocation"
                  placeholder="Search for a city or address"
                  class="w-full p-2 border rounded focus:ring-2 focus:ring-accent50 focus:border-transparent"
                />
                <ul
                  v-if="locationSuggestions.length > 0"
                  class="absolute z-20 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto"
                >
                  <li
                    v-for="suggestion in locationSuggestions"
                    :key="suggestion.place_id"
                    @click="selectSuggestion(suggestion)"
                    class="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  >
                    {{ suggestion.display_name }}
                  </li>
                </ul>
              </div>

              <button
                type="button"
                @click="useCurrentLocation"
                class="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <LocationIcon size="24" />
                <span class="hidden sm:inline">My Location</span>
              </button>
            </div>
            <MapView />
            <div
              v-if="selectedLocation"
              class="p-3 bg-gray-50 rounded-lg border"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium">{{ selectedLocation.display_name }}</p>
                  <p class="text-sm text-gray-600 mt-1">
                    Lat: {{ selectedLocation.lat.toFixed(4) }}, Lng:
                    {{ selectedLocation.lon.toFixed(4) }}
                  </p>
                </div>
                <button
                  @click="clearLocation"
                  class="text-gray-500 hover:text-red-500 transition-colors"
                  title="Clear location"
                >
                  <CloseIcon fillColor="#000" size="18" />
                </button>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label class="block text-textblack100 font-medium mb-1"
                >Date range</label
              >
              <Calendar
                v-model="dateRange"
                selectionMode="range"
                @update:modelValue="handleDateRangeChange"
                :minDate="minSelectableDate"
                :maxDate="maxSelectableDate"
                showIcon
                inputId="dateRange"
                class="w-full mr-2"
                dateFormat="yy-mm-dd"
                :manualInput="false"
                placeholder="Select trip dates"
              />
            </div>
          </div>

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
            @click="navigateToVoyages"
            class="px-4 py-2 border rounded text-textblack100 hover:bg-gray-100"
          >
            Cancel
          </button>
          <ReusableButton
            type="submit"
            class="px-4 py-2 bg-accent100 hover:bg-accent50 active:bg-accent50 text-white rounded"
            :disabled="isSubmitting"
            :label="isSubmitting ? 'Creating...' : 'Create Voyage'"
          />
        </div>
      </form>
    </main>
  </section>
</template>

<script setup lang="ts">
// imports from vue
import { computed, ref, watch } from "vue";
// imports from PrimeVue
import Editor from "primevue/editor";
import Rating from "primevue/rating";
import Calendar from "primevue/calendar";
// imports from ui components
import EditVoyageSkeleton from "@/components/ui/EditVoyageSkeleton.vue";
import ReusableButton from "@/components/ui/ReusableButton.vue";
import ReusableInput from "@/components/ui/ReusableInput.vue";
import Spinner from "@/components/ui/Spinner.vue";
// imports from icons
import EditIcon from "@/assets/icons/EditIcon.vue";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import TrashIcon from "@/assets/icons/TrashIcon.vue";
import CropIcon from "@/assets/icons/CropIcon.vue";
import RotateRight from "@/assets/icons/RotateRight.vue";
import RotateLeft from "@/assets/icons/RotateLeft.vue";
// imports from composables and functions
import { useVoyageManager } from "@/composables/useVoyageManager";
import { useImageUpload } from "@/composables/useImageUpload";
import { useMap } from "@/composables/useMap";
import { genUtils } from "@/utils/genUtils";

const { isLoading, navigateToVoyages } = useVoyageManager();
const { handleSubmit, isSubmitting, formData, formatDateForInput } = genUtils();
const {
  selectedLocation,
  locationSearch,
  locationSuggestions,
  searchLocation,
  selectSuggestion,
  useCurrentLocation,
  clearLocation,
} = useMap();

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
  modules,
  handles,
  imageStyle,
  cropBoxStyle,
  cropBox,
  croppedImage,
  dragOver,
  fileInput,
  isImgLoading,
  hasImage,
  showActionButtons,
  showOriginalImage,
  showCropBox,
  showCroppedImage,
  showEmptyState,
} = useImageUpload(formData);

interface DateRange extends Array<Date> {
  0: Date;
  1: Date;
}
const dateRange = ref<DateRange | null>(null);

const handleDateRangeChange = (range: DateRange | null) => {
  if (range && range.length === 2) {
    formData.value.startDate = formatDateForInput(range[0]);
    formData.value.endDate = formatDateForInput(range[1]);
  } else {
    formData.value.startDate = "";
    formData.value.endDate = "";
  }
};
// Date constraints
const minSelectableDate = computed(() => new Date());
const maxSelectableDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
});
// Watch for location changes and update form data
watch(selectedLocation, (newLocation) => {
  if (newLocation) {
    formData.value.location = newLocation.display_name;
    formData.value.latitude = newLocation.lat;
    formData.value.longitude = newLocation.lon;
  } else {
    formData.value.location = "";
    formData.value.latitude = null;
    formData.value.longitude = null;
  }
});

const typedHandles = handles as HandleKey[];
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
