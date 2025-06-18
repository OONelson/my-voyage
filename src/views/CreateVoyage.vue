<template>
  <div v-if="isPageLoading">
    <EditVoyageSkeleton />
  </div>
  <main v-else class="max-w-[800px] bg-background100 py-2 mx-auto px-3">
    <div class="flex justify-between items-center mb-5">
      <h4 class="text-textblack100">Create New Voyage</h4>
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

        <div
          class="h-48 bg-gray-100 rounded-md flex items-center justify-center gap-2 relative"
          :class="{
            'border-2 border-accent50 border-dashed': !formData.imageUrl,
            'border opacity-60': formData.imageUrl,
          }"
          @click="openFileInput"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
        >
          <!-- Drag overlay state -->
          <div
            v-if="dragOver"
            class="absolute inset-0 bg-accent50 bg-opacity-20 flex items-center justify-center border-2 border-accent50 border-dashed rounded-md"
          >
            <span class="text-accent50 font-medium">Drop image here</span>
          </div>

          <!-- Image preview -->
          <img
            v-if="formData.imageUrl"
            :src="formData.imageUrl"
            class="rounded-md w-full h-full object-cover"
          />

          <!-- Empty state -->
          <template v-else>
            <span class="text-textblack50">Drag & drop or click to upload</span>
            <EditIcon fillColor="textblack300" size="24" />
          </template>

          <!-- Edit overlay (shown when image exists) -->
          <div
            v-if="formData.imageUrl"
            class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md"
          >
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
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import Editor from "primevue/editor";
import Rating from "primevue/rating";
import ReusableButton from "@/components/ui/ReusableButton.vue";
import ReusableInput from "@/components/ui/ReusableInput.vue";
import EditIcon from "@/assets/icons/EditIcon.vue";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import { useDelayedLoading } from "../composables/useDelayedLoading";

const { isPageLoading } = useDelayedLoading();

const router = useRouter();
const isSubmitting = ref(false);
const dragOver = ref(false);

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

// loading
let loadingTimeout: ReturnType<typeof setTimeout>;

const setLoadingTimeout = () => {
  loadingTimeout = setTimeout(() => {
    isPageLoading.value = false;
  }, 3000);
};

// Call when needed
setLoadingTimeout();

// Clean up on component unmount
onUnmounted(() => {
  clearTimeout(loadingTimeout);
});

// File input ref
const fileInput = ref<HTMLInputElement | null>(null);

// Form data
const formData = ref({
  title: "",
  imageUrl: "",
  notes: "",
  location: "",
  date: "",
  rating: 0,
});

const openFileInput = () => {
  fileInput.value?.click();
};

const handleDrop = (e: DragEvent) => {
  dragOver.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0 && files[0].type.startsWith("image/")) {
    processImage(files[0]);
  }
};

const processImage = (file: Blob) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (typeof e.target?.result === "string") {
      formData.value.imageUrl = e.target.result;
    }
  };
  reader.readAsDataURL(file);
};

const goBack = () => {
  router.push("/voyages");
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // In a real app, you would call an API here
    console.log("Creating voyage:", formData.value);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect after successful creation
    router.push({
      path: "/voyages",
      query: {
        created: "true",
      },
    });
  } catch (err) {
    console.error("Error creating voyage:", err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.imageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};
</script>

<style scoped>
/* Custom styling for the rating stars */
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
