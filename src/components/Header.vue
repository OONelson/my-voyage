<template>
  <header
    class="flex justify-between items-center shadow-sm bg-white py-3 px-1"
  >
    <h4 class="text-textblack300 font-medium">myVoyage</h4>
    <Menu @click="openMenu" fillColor="text-textblack300" size="22" />
  </header>
  <SideSlider :isOpen="isMenuOpen" @close="closeMenu" />
</template>

<script setup lang="ts">
import Menu from "@/assets/icons/Menu.vue";
import SideSlider from "@/components/SideSlider.vue";
import { ref } from "vue";

const isMenuOpen = ref(false);

const openMenu = () => {
  isMenuOpen.value = true;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped></style>
