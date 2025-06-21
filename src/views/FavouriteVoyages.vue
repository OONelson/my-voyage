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
        <h3 class="text-2xl text-textblack100">Favorites</h3>
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

    <section @click.stop="isMenuOpen = false" class="lg:px-5">
      <div
        v-if="isPageLoading"
        class="md:grid grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <VoyagesSkeleton v-for="n in 6" :key="n" />
      </div>
      <div
        v-else-if="favoriteVoyages.length === 0"
        class="flex flex-col items-center justify-center h-[60vh]"
      >
        <HeartIcon size="60" fillColor="#e5e7eb" />
        <p class="text-textblack50 mt-4 text-center">
          You haven't favorited any voyages yet.<br />
          Start exploring and add some favorites!
        </p>
      </div>
      <div
        v-else
        class="px-3 flex flex-col justify-center md:items-start items-center md:grid grid-cols-2 lg:grid-cols-3 gap-4 my-4"
      >
        <article
          v-for="voyage in favoriteVoyages"
          :key="voyage.id"
          class="rounded-lg p-2 my-2 bg-white shadow-md max-w-[500px]"
          @click="navigateToVoyage(voyage.id)"
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
              @click.stop="toggleFavorite(voyage.id)"
            >
              <HeartIcon size="22" fillColor="#ff0000" />
            </div>
          </picture>

          <div class="flex justify-between items-center">
            <h4 class="pt-2 text-textblack100 font-medium text-xl leading-7">
              {{ voyage.title }}
            </h4>
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
      </div>
    </section>

    <!-- Create New Voyage Icon -->
    <div
      @click="toggleMenu"
      class="flex justify-center items-center fixed right-4 bottom-5 z-50 bg-white rounded-full shadow-lg w-12 h-12 p-2 sm:w-10 sm:h-10 cursor-pointer transition-transform duration-200 ease-in-out"
      :class="isMenuOpen ? 'rotate-45' : 'rotate-0'"
    >
      <AddIcon fillColor="#005b52" size="30" class="" />
    </div>

    <!-- popup menu -->
    <transition name="fab-menu">
      <div
        v-if="isMenuOpen"
        class="fixed right-10 bottom-16 w-48 bg-white rounded-lg shadow-xl py-1 z-50"
      >
        <!-- Voyages Option -->
        <div
          @click="navigateToVoyages"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center border-b"
        >
          <CompassIcon class="mr-2" size="22" fillColor="#005b52" />
          <span class="text-textblack100">All Voyages</span>
        </div>

        <!-- Create Voyage Option -->
        <div
          @click="navigateToCreate"
          class="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
        >
          <AddIcon class="mr-2" size="22" fillColor="#005b52" />
          <span class="text-textblack100">Create Voyage</span>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
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
import HeartIcon from "@/assets/icons/HeartIcon.vue";
import CompassIcon from "@/assets/icons/CompassIcon.vue";
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
const isMenuOpen = ref(false);
const favorites = ref<number[]>(
  JSON.parse(localStorage.getItem("favorites") || "[]")
);

// Filter favorite voyages
const favoriteVoyages = computed(() => {
  return voyages.value.filter((voyage) => favorites.value.includes(voyage.id));
});

const {
  editVoyageInList,
  confirmDeleteVoyage,
  openModal,
  closeModal,
  isSmallModalOpen,
  currentVoyageId,
} = useVoyageActions(voyages);
const { isPageLoading, executeWithDelay } = useDelayedLoading();

// Toggle favorite status
const toggleFavorite = (voyageId: number) => {
  const index = favorites.value.indexOf(voyageId);
  if (index === -1) {
    favorites.value.push(voyageId);
  } else {
    favorites.value.splice(index, 1);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites.value));
};

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

// Navigation methods
const navigateToVoyage = (id: number) => {
  router.push({
    path: `/voyages/${id}`,
    state: { voyages: JSON.stringify(voyages.value) },
  });
};

const navigateToVoyages = () => {
  router.push("/voyages");
  isMenuOpen.value = false;
};

const navigateToCreate = () => {
  router.push("/voyages/create");
  isMenuOpen.value = false;
};

// Profile modal
const openProfileModal = () => {
  isProfileModal.value = true;
};

const closeProfileModal = () => {
  isProfileModal.value = false;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

onMounted(() => {
  window.addEventListener("scroll", () => {
    scrolled.value = window.scrollY > 10;
  });
});
</script>

<style scoped>
.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: all 0.2s ease;
}

.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
