<template>
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

  <div v-if="isPageLoading">
    <SingleVoyageSkeleton />
  </div>
  <div v-else-if="error">
    <p>{{ error }}</p>

    <button @click="fetchVoyage(voyageId)">Retry</button>
  </div>
  <main
    class="w-full md:min-w-[300px] my-5 mx-auto px-3 xl:px-10"
    v-else-if="voyage"
  >
    <section
      class="lg:flex justify-between items-center gap-8 xl:gap-[5rem] lg:w-[950px] xl:w-full"
    >
      <div>
        <article
          class="rounded-lg p-2 my-2 bg-white shadow-md lg:min-w-[500px] xl:min-w-[600px]"
        >
          <picture class="md:flex justify-center items-center relative">
            <img
              v-if="voyage.imageUrl"
              :src="voyage.imageUrl"
              :alt="voyage.title"
              class="rounded-md w-full"
            />
            <div
              class="absolute right-2 top-2 cursor-pointer bg-white/90 rounded-full h-8 w-8 flex justify-center items-center"
            >
              <HeartIcon size="22" />
            </div>
          </picture>
          <div class="flex justify-between items-center pt-2">
            <h4 class="text-textblack100 font-medium">{{ voyage.title }}</h4>
            <div
              @click.stop="() => openOptionsModal(voyageId)"
              class="cursor-pointer"
            >
              <VerticalThreeDots fillColor="textblack100" />
            </div>
          </div>

          <ReusableModal
            :isOpen="isSmallModalOpen"
            :size="size"
            @close="closeModal"
          >
            <div>
              <div class="flex justify-end pb-2" @click="closeModal">
                <CloseIcon fillColor="border300" class="cursor-pointer" />
              </div>
              <div class="space-y-1">
                <div
                  class="w-full flex justify-between items-center px-1 py-1 hover:bg-gray-100 rounded cursor-pointer"
                  @click="handleEdit"
                >
                  <span> Edit Voyage </span>
                  <EditIcon />
                </div>

                <div
                  class="w-full flex justify-between items-center px-1 py-1 text-red-500 hover:bg-gray-100 rounded cursor-pointer"
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
        <!-- <div> -->
        <div class="bg-[#f8f8f8] rounded-lg p-2 mb-2">
          <div class="flex justify-between items-center pb-2">
            <h4 class="text-textblack100 font-normal text-xl">Notes</h4>
          </div>
          <p>{{ voyage.notes }}</p>
        </div>
      </div>
      <MapView />
      <!-- </div> -->
    </section>
    <router-link to="/voyages" class="flex items-center py-4 w-max">
      <ArrowBack fillColor="#498a80" />
      <span class="text-accent50"> Back to Voyages </span>
    </router-link>
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
import { dateAndTime } from "../utils/date-and-timeUtils";
import { useDelayedLoading } from "../composables/useDelayedLoading.ts";
import { useVoyageManager } from "../composables/useVoyageManager";
import { useRoute } from "vue-router";
import { watch } from "vue";
const { relativeTripDate, relativeCreatedAt } = dateAndTime();

const {
  voyage,
  scrolled,
  isProfileModal,
  isSmallModalOpen,
  size,
  voyageId,
  fetchVoyage,
  openProfileModal,
  closeProfileModal,
  openOptionsModal,
  handleEdit,
  handleDelete,
  closeModal,
} = useVoyageManager();
const { isPageLoading, error } = useDelayedLoading();

const route = useRoute();

// Load voyage data when component mounts or route changes
const loadVoyageData = async () => {
  const voyageId = Number(route.params.id);
  if (voyageId) {
    await fetchVoyage(voyageId);
  }
};

// Initial load
loadVoyageData();

// Watch for route changes
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
