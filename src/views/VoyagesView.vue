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
        class="flex justify-center items-center uppercase rounded-full outline outline-accent50 hover:outline-[#6fa198] outline-offset-2 w-7 h-7 cursor-pointer"
        @click="openProfileModal"
      >
        <UTooltip :text="userData.name">
          <UAvatar
            :src="userData?.profile_image"
            :alt="userData?.name"
            full
            @click="openProfileModal"
          />
        </UTooltip>
      </div>
    </header>

    <!-- Profile modal -->
    <ReusableModal :isOpen="isProfileModal" @close="closeProfileModal">
      <UserModal
        :username="userData.name"
        :avatar-url="userData.profile_image"
        @close="closeProfileModal"
      />
    </ReusableModal>

    <section @click.stop="isMenuOpen = false" class="lg:px-5">
      <div
        v-if="isLoading"
        class="md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3 mx-auto"
      >
        <VoyagesSkeleton v-for="n in voyages" :key="'skeleton-' + n" />
      </div>
      <div
        v-else-if="!voyages || voyages.length === 0"
        class="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <div class="max-w-md mx-auto">
          <img
            src="@/assets/images/empty_state2.png"
            alt="No voyages"
            class="w-full h-full"
          />
          <h3 class="text-xl font-medium text-gray-900 mb-2">No voyages yet</h3>
          <p class="text-gray-500 mb-6">
            Start your travel journey by creating your first voyage. Document
            your adventures and share them with others.
          </p>
          <button
            @click="navigateToCreate"
            class="px-6 py-2 bg-accent100 hover:bg-accent200 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <AddIcon size="18" fillColor="#ffffff" />
            Create First Voyage
          </button>
        </div>
      </div>

      <div
        v-else
        class="px-3 flex flex-col justify-center md:items-start items-center md:grid grid-cols-2 lg:grid-cols-3 gap-4 my-4"
      >
        <article
          v-for="voyage in voyages"
          :key="voyage.id"
          class="group relative rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 max-w-[500px] mx-auto"
          @click="navigateToVoyage(voyage.id)"
        >
          <!-- Image with Favorite Button -->
          <div class="relative aspect-[4/3]">
            <img
              v-if="voyage.image_url"
              :src="voyage.image_url"
              :alt="voyage.title"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"
            ></div>
            <button
              @click.stop="toggleFavorite(voyage.id)"
              class="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-sm transition-all z-10"
              aria-label="Favorite"
            >
              <HeartIcon
                size="20"
                :class="{
                  'text-red-500 fill-current': isFavorite(voyage.id),
                  'text-gray-400': !isFavorite(voyage.id),
                }"
              />
            </button>
          </div>

          <!-- Content -->
          <div class="p-2 sm:p-5">
            <!-- Title and Menu -->
            <div class="flex justify-between items-start gap-3 mb-2">
              <h3
                class="text-lg sm:text-xl font-medium text-gray-900 line-clamp-1"
              >
                {{ voyage.title }}
              </h3>
              <button @click.stop="handleEdit()">
                <EditIcon size="20" />
              </button>
            </div>

            <!-- Location and Date -->
            <div class="mt-2 flex items-center gap-2 text-normal">
              <LocationIcon size="26" />
              <span class="line-clamp-1">{{ voyage.location }}</span>
            </div>

            <!-- Created At -->
            <div class="flex flex-wrap items-center gap-2 text-normal mb-3">
              <WhatTimeIcon size="26" />
              <span>Created:</span>
              <span>{{ relativeCreatedAt(voyage.created_at) }}</span>
            </div>

            <!-- Rating -->
            <div
              class="flex items-center justify-between pt-3 border-t border-gray-100"
            >
              <Rating :rating="voyage.rating" size="md" class="flex-shrink-0" />
              <button
                @click.stop="navigateToVoyage(voyage.id)"
                class="text-sm font-medium text-accent50 hover:text-accent70 transition-colors flex items-center gap-1 hover:underline"
              >
                View details
                <ArrowRightIcon size="14" class="mt-0.5" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <div
      v-if="voyages.length > 0"
      @click="toggleMenu"
      class="flex justify-center items-center fixed right-4 bottom-5 z-30 bg-white rounded-full shadow-lg w-12 h-12 p-2 sm:w-10 sm:h-10 cursor-pointer transition-transform duration-200 ease-in-out"
      :class="isMenuOpen ? 'rotate-45' : 'rotate-0'"
    >
      <AddIcon fillColor="#005b52" size="30" />
    </div>

    <!-- popup menu -->
    <transition name="fab-menu">
      <div
        v-if="isMenuOpen"
        class="fixed right-10 bottom-16 w-48 bg-white rounded-lg shadow-xl py-1 z-50"
      >
        <!-- Favorites Option -->
        <div
          @click="navigateToFavorites"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center border-b"
        >
          <HeartIcon class="mr-2" size="22" fillColor="#005b52" />
          <span class="text-textblack100">Favorites</span>
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
import { ref } from "vue";
import Rating from "@/components/Rating.vue";
import ReusableModal from "@/components/ui/ReusableModal.vue";
import VoyagesSkeleton from "@/components/ui/VoyagesSkeleton.vue";
import UserModal from "@/components/UserModal.vue";
import Logo from "@/assets/icons/Logo.vue";
import AddIcon from "@/assets/icons/AddIcon.vue";
import EditIcon from "@/assets/icons/EditIcon.vue";
import HeartIcon from "@/assets/icons/HeartIcon.vue";
import LocationIcon from "@/assets/icons/LocationIcon.vue";
import WhatTimeIcon from "@/assets/icons/WhatTimeIcon.vue";
import { useVoyageManager } from "@/composables/useVoyageManager";
import { useUserProfile } from "@/composables/useUserProfile";
import { dateAndTime } from "@/utils/date-and-timeUtils";

const { relativeCreatedAt } = dateAndTime();
const {
  voyages,
  scrolled,
  isMenuOpen,
  isProfileModal,
  isLoading,
  toggleMenu,
  navigateToCreate,
  navigateToFavorites,
  navigateToVoyage,
  openProfileModal,
  closeProfileModal,
  handleEdit,
} = useVoyageManager();

const { userData } = useUserProfile();

const favorites = ref<number[]>([]);
const isFavorite = (id: number) => favorites.value.includes(id);
const toggleFavorite = (id: number) => {
  const index = favorites.value.indexOf(id);
  if (index > -1) {
    favorites.value.splice(index, 1);
  } else {
    favorites.value.push(id);
  }
};
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
