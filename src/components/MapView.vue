<template>
  <div class="h-screen flex flex-col">
    <div class="flex gap-12 items-center p-4 bg-white shadow">
      <select
        v-model="selectedStyle"
        @change="changeStyle(selectedStyle)"
        class="p-2 border rounded"
      >
        <option value="streets">Streets</option>
        <option value="satellite">Satellite</option>
        <option value="hybrid">Hybrid</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <div class="flex flex-col gap-2">
        <ReusableButton
          @click="addSampleMarkers"
          class="bg-accent100 text-white py-2"
          label="Add Markers"
        />

        <ReusableButton
          @click="removeAllMarkers"
          class="bg-red-500 text-white px-2 py-2"
          label="Clear Markers"
        />
      </div>
    </div>

    <div ref="mapContainer" class="flex-1 w-full" />

    <div class="p-4 bg-white border-t flex gap-2">
      <button
        v-for="location in locations"
        :key="location.name"
        @click="centerOnLocation(location.coords)"
        class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
      >
        Fly to {{ location.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMap } from "../composables/useMap.ts";
import ReusableButton from "./ui/ReusableButton.vue";

type MapStyle = "streets" | "satellite" | "hybrid" | "light" | "dark";

const {
  mapContainer,
  initMap,
  addMarker,
  flyTo,
  changeStyle,
  style,
  removeAllMarkers,
} = useMap();
const locations = ref<{ name: string; coords: [number, number] }[]>([
  { name: "Paris", coords: [2.3522, 48.8566] },
  { name: "Tokyo", coords: [139.6917, 35.6895] },
  { name: "New York", coords: [-74.006, 40.7128] },
]);

const selectedStyle = ref<MapStyle>("streets");

onMounted(() => {
  initMap({
    center: [0, 20],
    zoom: 2,
    style: "streets",
  });
});

const addSampleMarkers = () => {
  locations.value.forEach((loc) => {
    addMarker(loc.coords, {
      color: "#498A80",
      popup: `<div class="p-2 font-sans">${loc.name}</div>`,
    });
  });
};

const centerOnLocation = (coords: [number, number]) => {
  flyTo(coords, 8);
};
</script>
