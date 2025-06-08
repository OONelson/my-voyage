<template>
  <header
    class="flex justify-between items-center shadow-sm bg-white py-3 px-1"
  >
    <div class="flex justify-between items-center">
      <logo />
      <h4 class="text-textblack300 font-medium">Zende</h4>
    </div>
    <Menu @click="openMenu" fillColor="text-textblack300" size="22" />
  </header>
  <SideSlider :isOpen="isMenuOpen" @close="closeMenu" />
</template>

<script setup lang="ts">
defineOptions({ name: "AppHeader" });
import Logo from "@/assets/icons/Logo.vue";
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
