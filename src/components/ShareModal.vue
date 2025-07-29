<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
      <!-- Header with close button -->
      <div class="p-6 pb-4 border-b">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Share with Friends</h2>
            <p class="text-sm text-gray-500 mt-1">
              Trading is more effective when you connect with friends!
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="p-6">
        <!-- Link Copy Section -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Share your link</label
          >
          <div class="flex rounded-md shadow-sm">
            <input
              ref="urlInput"
              v-model="pageUrl"
              readonly
              class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @click="selectUrlText"
            />
            <button
              @click="copyLink"
              class="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {{ copyButtonText }}
            </button>
          </div>
        </div>

        <!-- PDF Download Button -->
        <button
          @click="handleDownloadPdf"
          class="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
        >
          <svg
            class="-ml-1 mr-2 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          Download as PDF
        </button>

        <!-- Social Share Buttons -->
        <div>
          <p class="text-sm font-medium text-gray-700 mb-3">Share to</p>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="platform in platforms"
              :key="platform.socialMedia"
              @click="share(platform.socialMedia)"
              class="flex flex-col items-center group"
              :aria-label="`Share on ${platform.socialMedia}`"
            >
              <div
                class="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors"
              >
                <img
                  :src="platform.icon"
                  :alt="platform.socialMedia"
                  class="w-6 h-6"
                />
              </div>
              <span
                class="text-xs text-gray-500 mt-2 hidden sm:inline-block capitalize"
              >
                {{ platform.socialMedia }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { SocialPlatform } from "../types/social";
import { platforms } from "../constants/constant";
import { usePdfExport } from "../composables/usePdfExport";

interface Props {
  contentElementId?: string;
  defaultFilename?: string;
}

const props = withDefaults(defineProps<Props>(), {
  contentElementId: "share-content",
  defaultFilename: "my-journal",
});

const emit = defineEmits(["close"]);

const { exportToPdf } = usePdfExport();
const urlInput = ref<HTMLInputElement | null>(null);
const pageUrl = ref(window.location.href);
const copyButtonText = ref("Copy Link");

const selectUrlText = () => {
  if (urlInput.value) {
    urlInput.value.select();
  }
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(pageUrl.value);
    copyButtonText.value = "Copied!";
    setTimeout(() => {
      copyButtonText.value = "Copy Link";
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
    selectUrlText();
    copyButtonText.value = "Press Ctrl+C";
  }
};

const handleDownloadPdf = () => {
  exportToPdf(props.contentElementId, props.defaultFilename);
  emit("close");
};

const share = (platform: SocialPlatform) => {
  const shareUrl = new URL(pageUrl.value);
  const shareText = "Check out my travel journal!";
  let url = "";

  switch (platform) {
    case "facebook":
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl.toString()
      )}`;
      break;
    case "x":
      url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl.toString()
      )}&text=${encodeURIComponent(shareText)}`;
      break;
    case "whatsapp":
      url = `https://wa.me/?text=${encodeURIComponent(
        `${shareText}: ${shareUrl.toString()}`
      )}`;
      break;
    case "linkedin":
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl.toString()
      )}`;
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  window.open(url, "_blank", "noopener,noreferrer");
};
</script>
