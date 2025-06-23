<template>
  <header
    class="flex justify-between items-center sticky top-0 z-50 w-full bg-white border-b transition-shadow px-2 py-2"
    :class="{ 'shadow-md': scrolled }"
  >
    <div class="flex items-center gap-2">
      <router-link to="/" class="flex items-center justify-center">
        <Logo />
      </router-link>
      <USkeleton
        v-if="isLoading"
        class="h-4 w-[150px] base rounded-md bg-skeleton"
      />
      <h3 v-else class="text-xl text-textblack100">
        Your trip to {{ voyage?.location }}
      </h3>
    </div>
    <div
      class="rounded-full outline outline-accent50 hover:outline-[#6fa198] outline-offset-2 w-7 h-7 cursor-pointer"
      @click="openProfileModal"
    >
      <UTooltip text="Benjamin Canac">
        <UAvatar
          src="https://github.com/benjamincanac.png"
          alt="Benjamin Canac"
          full
          @click="openProfileModal"
        />
      </UTooltip>
    </div>
  </header>

  <!-- Profile modal -->
  <ReusableModal :isOpen="isProfileModal" @close="closeProfileModal">
    <UserModal @close="closeProfileModal" />
  </ReusableModal>

  <div v-if="isLoading">
    <SingleVoyageSkeleton />
  </div>
  <div v-else-if="error">
    <p>{{ error }}</p>

    <button @click="fetchVoyage(voyageId)">Retry</button>
  </div>
  <main
    v-else-if="voyage"
    class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
  >
    <!-- Back Button -->
    <router-link
      to="/voyages"
      class="flex items-center gap-2 text-accent50 hover:text-accent70 transition-colors mb-6 w-max"
    >
      <ArrowBack fillColor="currentColor" />
      <span class="font-medium">Back to Voyages</span>
    </router-link>

    <!-- Main Content -->
    <div class="flex flex-col lg:flex-row gap-8 xl:gap-12">
      <!-- Left Column - Voyage Details -->
      <div class="flex-1">
        <!-- Voyage Card -->
        <article class="bg-white rounded-xl shadow-sm overflow-hidden">
          <!-- Image with Heart Icon -->
          <div class="relative">
            <img
              v-if="voyage.imageUrl"
              :src="voyage.imageUrl"
              :alt="voyage.title"
              class="w-full h-auto max-h-[400px] object-cover"
            />
            <div class="absolute top-4 right-4">
              <button
                class="bg-white/90 hover:bg-white rounded-full p-2 shadow-sm transition-all"
                @click.stop="toggleFavorite"
              >
                <HeartIcon size="22" :filled="isFavorite" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 sm:p-6">
            <!-- Title and Menu -->
            <div class="flex justify-between items-start gap-2">
              <h3
                class="text-xl md:text-2xl font-medium text-gray-900 flex-wrap"
              >
                {{ voyage.title }}
              </h3>
              <div
                @click.stop="openOptionsModal(voyageId)"
                class="cursor-pointer hover:text-gray-700 transition-colors"
              >
                <VerticalThreeDots fillColor="textblack100" />
              </div>
            </div>

            <!-- Location and Date -->
            <div class="mt-2 flex items-center gap-2 text-normal">
              <LocationIcon size="26" />
              <span class="line-clamp-1">{{ voyage.location }}</span>
              <span class="hidden md:block">•</span>
              <span class="hidden md:block">{{
                relativeTripDate(voyage.date)
              }}</span>
            </div>

            <!-- Created At -->
            <div class="flex flex-wrap items-center gap-2 text-normal mb-3">
              <WhatTimeIcon size="26" />
              <span>Created:</span>
              <span class="">{{ relativeCreatedAt(voyage.createdAt) }}</span>
            </div>

            <!-- Rating -->
            <div class="mt-6 pt-4 border-t border-gray-100">
              <div class="flex items-center gap-3">
                <Rating :rating="voyage.rating" size="md" show-comment />
              </div>
            </div>
          </div>
        </article>

        <!-- Notes Section -->
        <div class="mt-6 bg-gray-50 rounded-xl p-5 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-medium text-gray-900">Notes</h2>
          </div>
          <div class="prose prose-sm max-w-none text-gray-600">
            <p>{{ voyage.notes }}</p>
          </div>
        </div>
      </div>

      <!-- Right Column - Map -->
      <div class="w-full lg:w-[40%] xl:w-[35%]">
        <div
          class="sticky top-6 h-[400px] sm:h-[500px] lg:h-[550px] rounded-xl overflow-hidden shadow-sm"
        >
          <MapView :location="voyage.location" />
        </div>
      </div>
    </div>

    <!-- Options Modal -->
    <ReusableModal :isOpen="isSmallModalOpen" @close="closeModal">
      <div class="p-2">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-medium">Voyage Options</h3>
          <button @click="closeModal">
            <CloseIcon fillColor="textblack100" size="20" />
          </button>
        </div>
        <div>
          <button
            @click="handleEdit"
            class="w-full flex justify-between items-center px-2 py-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span>Edit Voyage</span>
            <EditIcon class="text-gray-400" />
          </button>
          <button
            @click="handleDelete"
            class="w-full flex justify-between items-center px-2 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span>Delete Voyage</span>
            <TrashIcon class="text-red-400" />
          </button>
        </div>
      </div>
    </ReusableModal>
  </main>
</template>

<script setup lang="ts">
import MapView from "@/components/MapView.vue";
import ReusableModal from "@/components/ui/ReusableModal.vue";
import SingleVoyageSkeleton from "@/components/ui/SingleVoyageSkeleton.vue";
import VerticalThreeDots from "@/assets/icons/VerticalThreeDots.vue";
import ArrowBack from "@/assets/icons/ArrowBack.vue";
import EditIcon from "@/assets/icons/EditIcon.vue";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import TrashIcon from "@/assets/icons/TrashIcon.vue";
import HeartIcon from "@/assets/icons/HeartIcon.vue";
import LocationIcon from "@/assets/icons/LocationIcon.vue";
import WhatTimeIcon from "@/assets/icons/WhatTimeIcon.vue";
import Logo from "@/assets/icons/Logo.vue";
import { dateAndTime } from "../utils/date-and-timeUtils";
import { useVoyageManager } from "../composables/useVoyageManager";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
const { relativeTripDate, relativeCreatedAt } = dateAndTime();

const {
  voyage,
  scrolled,
  isProfileModal,
  isSmallModalOpen,
  voyageId,
  isLoading,
  error,
  fetchVoyage,
  openProfileModal,
  closeProfileModal,
  openOptionsModal,
  handleEdit,
  handleDelete,
  closeModal,
} = useVoyageManager();
const isFavorite = ref(false);

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

const route = useRoute();

const loadVoyageData = async () => {
  const voyageId = Number(route.params.id);
  if (voyageId) {
    await fetchVoyage(voyageId);
  }
};

loadVoyageData();

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadVoyageData();
    }
  }
);
</script>

<style scoped></style>
