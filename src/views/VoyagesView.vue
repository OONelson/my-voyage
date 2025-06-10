<template>
  <main>
    <header
      class="flex justify-between items-center sticky top-0 z-50 w-full bg-white border-b transition-shadow mb-5 px-2 py-2"
      :class="{ 'shadow-md': scrolled }"
    >
      <div class="flex items-center">
        <router-link to="/" class="flex items-center justify-center">
          <Logo />
        </router-link>
        <h3 class="text-textblack100">voyages</h3>
      </div>
      <div
        class="rounded-full outline outline-accent50 hover:outline-[#6fa198] outline-offset-2 w-10 cursor-pointer"
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
    <UserModal />

    <section class="px-3 flex flex-col justify-center items-center">
      <article
        v-for="voyage in MergedVoyages"
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
          <div @click.stop="openModal(voyage.id)" class="cursor-pointer">
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
                >
                  <span> Edit Voyage </span>
                  <EditIcon />
                </div>
                <!-- <button class="w-full px-2 hover:bg-gray-100 rounded">
                  Share Voyage
                </button> -->
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
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { MergedVoyages as mergedVoyagesData } from "../constants/constant";
import { dateAndTime } from "../utils/date-and-timeUtils";
import VerticalThreeDots from "@/assets/icons/VerticalThreeDots.vue";
import Rating from "@/components/Rating.vue";
import ReusableModal from "@/components/ui/ReusableModal.vue";
import Logo from "../assets/icons/Logo.vue";
import CloseIcon from "../assets/icons/CloseIcon.vue";
import EditIcon from "../assets/icons/EditIcon.vue";
import TrashIcon from "../assets/icons/TrashIcon.vue";

const { relativeTripDate, relativeCreatedAt } = dateAndTime();

const router = useRouter();

const scrolled = ref<boolean>(false);

const isProfileModal = ref<boolean>(false);

const isSmallModalOpen = ref<boolean>(false);
const currentVoyageId = ref<string | number | null>(null);
const MergedVoyages = ref(mergedVoyagesData);

// Three dots action
const openModal = (voyageId: string | number | null) => {
  currentVoyageId.value = voyageId;
  isSmallModalOpen.value = true;
};
const closeModal = () => {
  isSmallModalOpen.value = false;
  currentVoyageId.value = null;
};
const deleteVoyage = (voyageId: string | number | null) => {
  // Your delete logic here
  closeModal();
};

const openProfileModal = () => {
  isProfileModal.value = true;
};

const closeMenu = () => {
  isProfileModal.value = false;
};
const navigateToVoyage = (id: number) => {
  router.push(`/voyages/${id}`);
};

onMounted(() => {
  window.addEventListener("scroll", () => {
    scrolled.value = window.scrollY > 10;
  });
});
</script>

<style scoped></style>
