<template>
  <ReusableModal
    :isOpen="isModalOpen"
    title="Nav Menu"
    size="lg"
    @close="isModalOpen = false"
  >
    <template #body>
      <div v-if="isModalOpen">
        <div></div>
      </div>
    </template>
  </ReusableModal>
</template>

<script setup lang="ts">
import ReusableModal from "@/components/ui/ReusableModal.vue";
import Menu from "@/assets/icons/Menu.vue";
</script>

<style scoped></style>
