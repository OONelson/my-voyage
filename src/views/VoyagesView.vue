<template>
  <main>
    <header
      class="flex justify-between items-center sticky top-0 z-50 w-full bg-white border-b transition-shadow px-2 py-2"
      :class="{ 'shadow-md': scrolled }"
    >
      <div class="flex items-center">
        <router-link to="/" class="flex items-center justify-center">
          <Logo />
        </router-link>
        <h3 class="text-2xl text-textblack100">voyages</h3>
      </div>
      <div
        class="rounded-full outline outline-accent50 hover:outline-[#6fa198] outline-offset-2 cursor-pointer"
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

    <section class="px-3 flex flex-col justify-center items-center my-4">
      <div v-if="isPageLoading">
        <VoyagesSkeleton v-for="n in voyages" :key="n" />
      </div>
      <article
        v-else
        v-for="voyage in voyages"
        :key="voyage.id"
        class="rounded-lg p-2 my-2 bg-white shadow-md max-w-[500px]"
        @click="navigateToVoyage(voyage.id)"
      >
        <img
          v-if="voyage.imageUrl"
          :src="voyage.imageUrl"
          :alt="voyage.title"
          class="rounded-md w-full"
        />
        <div class="flex justify-between items-center">
          <h4 class="pt-2 text-textblack100 font-medium">{{ voyage.title }}</h4>
          <div
            @click.stop="() => openOptionsModal(voyage.id)"
            class="cursor-pointer"
          >
            <VerticalThreeDots fillColor="textblack100" />
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
        </div>
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
    </section>

    <!-- Create New Voyage Icon -->
    <div
      @click="navigateToCreate"
      class="flex justify-center items-center fixed right-4 bottom-5 z-50 bg-white rounded-full shadow-lg w-12 h-12 p-2 sm:w-10 sm:h-10 cursor-pointer"
    >
      <AddIcon fillColor="#005b52" size="30" class="" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Rating from "@/components/Rating.vue";
import ReusableModal from "@/components/ui/ReusableModal.vue";
import VoyagesSkeleton from "@/components/ui/VoyagesSkeleton.vue";
import UserModal from "@/components/UserModal.vue";
import VerticalThreeDots from "@/assets/icons/VerticalThreeDots.vue";
import Logo from "@/assets/icons/Logo.vue";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import AddIcon from "@/assets/icons/AddIcon.vue";
import EditIcon from "@/assets/icons/EditIcon.vue";
import TrashIcon from "@/assets/icons/TrashIcon.vue";
import { useVoyageActions } from "../composables/useVoyageActions";
import { useDelayedLoading } from "../composables/useDelayedLoading";
import { Voyages } from "../constants/constant";
import type { VoyageTypeInfo } from "../types/Voyage";
import { dateAndTime } from "../utils/date-and-timeUtils";

const router = useRouter();
const { relativeTripDate, relativeCreatedAt } = dateAndTime();

const scrolled = ref<boolean>(false);
const isProfileModal = ref<boolean>(false);
const voyages = ref<VoyageTypeInfo[]>(Voyages);

const {
  editVoyageInList,
  confirmDeleteVoyage,
  openModal,
  closeModal,
  isSmallModalOpen,
  currentVoyageId,
} = useVoyageActions(voyages);
const { isPageLoading, executeWithDelay } = useDelayedLoading();

// useVoyageActions
const openOptionsModal = (voyageId: number) => {
  openModal(voyageId);
};

const handleEdit = () => {
  if (currentVoyageId.value) {
    editVoyageInList(currentVoyageId.value);
    closeModal();
  }
};

const handleDelete = () => {
  if (currentVoyageId.value) {
    confirmDeleteVoyage(currentVoyageId.value);
    closeModal();
  }
};
const loadVoyages = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Voyages;
};

onMounted(async () => {
  voyages.value = await executeWithDelay(loadVoyages());
});
// Navigate to voyage details
const navigateToVoyage = (id: number) => {
  router.push({
    path: `/voyages/${id}`,
    state: { voyages: JSON.stringify(voyages.value) }, // Pass the data via route state as a string
  });
};

// Naviagate to craete new voyage page
const navigateToCreate = () => {
  router.push("/voyages/create");
};

// Profile modal
const openProfileModal = () => {
  isProfileModal.value = true;
};

const closeProfileModal = () => {
  isProfileModal.value = false;
};

onMounted(() => {
  window.addEventListener("scroll", () => {
    scrolled.value = window.scrollY > 10;
  });
});
</script>

<style scoped></style>
