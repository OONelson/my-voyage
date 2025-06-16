<template>
  <div v-if="isPageLoading">
    <SingleVoyageSkeleton />
  </div>
  <div v-else-if="error">
    <p>{{ error }}</p>

    <button @click="fetchVoyage(voyageId)">Retry</button>
  </div>
  <main class="max-w-[800px] my-2 mx-auto px-3" v-else-if="voyage">
    <article class="rounded-lg p-2 my-2 bg-white shadow-md">
      <img
        v-if="voyage.imageUrl"
        :src="voyage.imageUrl"
        :alt="voyage.title"
        class="rounded-md"
      />
      <div class="flex justify-between items-center">
        <h4 class="text-textblack100 font-medium">{{ voyage.title }}</h4>
        <div @click.stop="openOptionsModal" class="cursor-pointer">
          <VerticalThreeDots fillColor="textblack100" />
        </div>
      </div>

      <ReusableModal :isOpen="isSmallModalOpen" size="sm" @close="closeModal">
        <div>
          <div class="flex justify-end pb-2" @click="closeModal">
            <CloseIcon fillColor="border300" />
          </div>
          <div class="space-y-1">
            <div
              class="w-full flex justify-between items-center px-1 hover:bg-gray-100 rounded"
              @click="handleEdit"
            >
              <span> Edit Voyage </span>
              <EditIcon />
            </div>

            <div
              class="w-full flex justify-between items-center px-1 text-red-500 hover:bg-gray-100 rounded"
              @click="handleDelete"
            >
              <span> Delete Voyage </span>
              <TrashIcon />
            </div>
          </div>
        </div>
      </ReusableModal>

      <p class="text-textblack50">
        {{ voyage.location }} • {{ relativeTripDate(voyage.date) }}
      </p>
      <p>
        <span class="text-textblack100 font-medium"> Created: </span>
        <span class="textblack50">
          {{ relativeCreatedAt(voyage.createdAt) }}
        </span>
      </p>
      <div class="mt-3 pt-3 border-t text-sm">
        <Rating :rating="voyage.rating" show-comment />
      </div>
    </article>
    <div class="bg-[#f8f8f8] rounded-lg p-2 mb-2">
      <div class="flex justify-between items-center pb-2">
        <h4 class="text-textblack100 font-normal text-xl">Notes</h4>
        <EditIcon fill-color="textblack100" />
      </div>
      <p>{{ voyage.notes }}</p>
    </div>
    <MapView />
    <router-link to="/voyages" class="flex items-center py-4">
      <ArrowBack fillColor="#498a80" />
      <span class="text-accent50"> Back to Voyages </span>
    </router-link>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import MapView from "@/components/MapView.vue";
import ReusableModal from "@/components/ui/ReusableModal.vue";
import SingleVoyageSkeleton from "@/components/ui/SingleVoyageSkeleton.vue";
import VerticalThreeDots from "@/assets/icons/VerticalThreeDots.vue";
import ArrowBack from "@/assets/icons/ArrowBack.vue";
import EditIcon from "@/assets/icons/EditIcon.vue";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import TrashIcon from "@/assets/icons/TrashIcon.vue";
import { dateAndTime } from "../utils/date-and-timeUtils";
import { useVoyageActions } from "../composables/useVoyageActions.ts";
import { useDelayedLoading } from "../composables/useDelayedLoading.ts";
import type { VoyageTypeInfo } from "../types/Voyage";
import { Voyages } from "../constants/constant";

const route = useRoute();
const voyage = ref<VoyageTypeInfo | null>(null);
const { relativeTripDate, relativeCreatedAt } = dateAndTime();
const voyageId = parseInt(route.params.id as string);

const {
  editVoyage,
  confirmDeleteVoyage,
  openModal,
  closeModal,
  isSmallModalOpen,
  fetchVoyage,
} = useVoyageActions();
const { isPageLoading, error, executeWithDelay } = useDelayedLoading();

const handleEdit = () => {
  if (voyage.value?.id) {
    editVoyage(voyage.value.id);
    closeModal();
  }
};

const handleDelete = () => {
  if (voyage.value?.id) {
    confirmDeleteVoyage(voyage.value.id);
    closeModal();
  }
};

const openOptionsModal = () => {
  if (voyage.value?.id) {
    openModal(voyage.value.id);
  }
};

const loadVoyageData = async () => {
  // If voyages are passed as a route param (e.g., via query or params)
  if (route.params.voyages) {
    try {
      const voyages = JSON.parse(route.params.voyages as string);
      return voyages.find((v: VoyageTypeInfo) => v.id === voyageId) || null;
    } catch (e) {
      console.error("Error parsing voyage data", e);
      // Fallback to fetching from API or constant
    }
  }
  return (
    Voyages.find((v) => v.id === voyageId) || (await fetchVoyage(voyageId))
  );
};

onMounted(async () => {
  voyage.value = await executeWithDelay(loadVoyageData());
});
</script>

<style scoped></style>
../composables/useDelayedLoading.ts
