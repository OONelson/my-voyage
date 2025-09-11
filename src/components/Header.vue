<template>
  <header
    class="flex justify-between items-center shadow-sm bg-white py-3 px-1"
  >
    <div class="flex justify-between items-center">
      <logo />
      <h4 class="text-textblack300 font-medium">Zende</h4>
    </div>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center gap-6 text-sm text-textblack300">
      <a href="#start" class="hover:text-accent50">Start Here</a>
      <a href="#benefits" class="hover:text-accent50">Benefits</a>
      <a href="#process" class="hover:text-accent50">Process</a>
      <a href="#compare" class="hover:text-accent50">Compare</a>
      <router-link to="/pricing" class="hover:text-accent50"
        >Pricing</router-link
      >
      <a href="#faqs" class="hover:text-accent50">FAQs</a>
      <router-link
        to="/pricing"
        class="ml-2 px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800"
      >
        View Plans
      </router-link>
    </nav>

    <!-- Mobile -->
    <Menu
      @click="openMenu"
      fillColor="text-textblack300"
      size="22"
      class="md:hidden"
    />
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
