<template>
  <div class="h-80 border rounded-lg overflow-hidden relative bg-gray-100">
    <div ref="mapContainer" class="w-full h-full"></div>

    <div
      v-if="!isMapInitialized"
      class="absolute inset-0 flex items-center justify-center"
    >
      <Spinner />
    </div>

    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <div
        class="w-8 h-8 border-4 border-accent50 rounded-full pointer-events-none"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useMap } from "../composables/useMap";

const { mapContainer, isMapInitialized, initMap } = useMap();

onMounted(async () => {
  if (mapContainer.value) {
    await initMap(mapContainer.value);
  }
});
</script>

<style scoped></style>
