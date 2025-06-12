<template>
  <main class="max-w-[800px] my-2 mx-auto px-3" v-if="voyage">
    <article class="rounded-lg p-2 my-2 bg-white shadow-md">
      <img
        v-if="voyage.imageUrl"
        :src="voyage.imageUrl"
        :alt="voyage.title"
        class="rounded-md"
      />
      <div class="flex justify-between items-center">
        <h4 class="text-textblack100 font-medium">{{ voyage.title }}</h4>
        <div @click.stop="openModal(voyage.id)" class="cursor-pointer">
          <VerticalThreeDots fillColor="textblack100" />
        </div>
      </div>

      <ReusableModal
        :isOpen="isSmallModalOpen && currentVoyageId === voyage.id"
        size="sm"
        @close="closeModal"
      >
        <div>
          <div class="flex justify-end pb-2" @click="closeModal">
            <CloseIcon fillColor="border300" />
          </div>
          <div class="space-y-1">
            <div
              class="w-full flex justify-between items-center px-1 hover:bg-gray-100 rounded"
              @click="editVoyage(voyage.id)"
            >
              <span> Edit Voyage </span>
              <EditIcon />
            </div>

            <div
              class="w-full flex justify-between items-center px-1 text-red-500 hover:bg-gray-100 rounded"
              @click="deleteVoyage(voyage.id)"
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
  <div v-else>
    <p>Loading voyage...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { dateAndTime } from "../utils/date-and-timeUtils";
import { useVoyageActions } from "../composables/useVoyageActions.ts";
import MapView from "../components/MapView.vue";
import ReusableModal from "../components/ui/ReusableModal.vue";
import { MergedVoyages as mergedVoyagesData } from "../constants/constant";
import Voyage from "../types/Voyage";
import VerticalThreeDots from "../assets/icons/VerticalThreeDots.vue";
import ArrowBack from "../assets/icons/ArrowBack.vue";
import EditIcon from "../assets/icons/EditIcon.vue";
import CloseIcon from "../assets/icons/CloseIcon.vue";
import TrashIcon from "../assets/icons/TrashIcon.vue";

const route = useRoute();
const voyage = ref<Voyage | null>(null);
const { relativeTripDate, relativeCreatedAt } = dateAndTime();
const {
  editVoyage,
  confirmDeleteVoyage,
  deleteVoyage,
  openModal,
  closeModal,
  isSmallModalOpen,
  currentVoyageId,
} = useVoyageActions();

const MergedVoyages = ref(mergedVoyagesData);

onMounted(() => {
  const voyageId = Number(route.params.id);
  voyage.value = MergedVoyages.value.find((v) => v.id === voyageId);
});
</script>

<style scoped></style>
