<template>
  <main>
    <div
      class="flex justify-between items-center sticky top-0 z-50 w-full bg-white border-b transition-shadow mb-5 px-2 py-2"
      :class="{ 'shadow-md': scrolled }"
    >
      <div class="flex items-center justify-center">
        <Logo />
        <h3 class="text-textblack100">voyages</h3>
      </div>
      <Menu @click="openMenu" fillColor="text-textblack100" size="22" />
    </div>
    <SideSlider :isOpen="isMenuOpen" @close="closeMenu" />
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
          <VerticalThreeDots fillColor="textblack100" />
        </div>
        <p class="text-textblack50">
          {{ voyage.location }} • {{ formatDate(voyage.date) }}
        </p>
        <div class="mt-3 pt-3 border-t text-sm text-gray-500">
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
import VerticalThreeDots from "@/assets/icons/VerticalThreeDots.vue";
import Menu from "@/assets/icons/Menu.vue";
import Rating from "@/components/Rating.vue";
import SideSlider from "@/components/SideSlider.vue";
import Logo from "../assets/icons/Logo.vue";

const router = useRouter();

const scrolled = ref(false);

const isMenuOpen = ref(false);

const MergedVoyages = ref(mergedVoyagesData);

const openMenu = () => {
  isMenuOpen.value = true;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
const navigateToVoyage = (id: number) => {
  router.push(`/voyages/${id}`);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onMounted(() => {
  window.addEventListener("scroll", () => {
    scrolled.value = window.scrollY > 10;
  });
});
</script>

<style scoped></style>
