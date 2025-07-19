<template>
  <div class="h-screen flex flex-col lg:min-w-[760px] xl:min-w-[800px]">
    <div class="flex justify-between gap-12 items-center p-4 bg-white shadow">
      <select
        v-model="selectedStyle"
        @change="changeStyle(selectedStyle)"
        class="p-2 border rounded"
      >
        <option value="streets">Streets</option>
        <option value="satellite">Satellite</option>
        <option value="hybrid">Hybrid</option>
      </select>
      <div class="flex lg:flex-row flex-col gap-2">
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
import ReusableButton from "@/components/ui/ReusableButton.vue";
import { useMap } from "../composables/useMap.ts";
import { Voyages } from "../constants/constant";
import { locationToCoordinates } from "../utils/geoCode";
import type { VoyageTypeInfo } from "../types/voyage.ts";

type MapStyle = "streets" | "satellite" | "hybrid";
const {
  mapContainer,
  map,
  initMap,
  addMarker,
  flyTo,
  changeStyle,
  removeAllMarkers,
} = useMap();

const selectedStyle = ref<MapStyle>("streets");

const locations = ref<{ name: string; coords: [number, number] }[]>([
  { name: "Paris", coords: [2.3522, 48.8566] },
  { name: "Tokyo", coords: [139.6917, 35.6895] },
  { name: "New York", coords: [-74.006, 40.7128] },
]);

onMounted(() => {
  initMap({
    center: [0, 20],
    zoom: 2,
    style: selectedStyle.value,
  });
});

map.value?.on("load", () => {
  // Add voyage markers
  Voyages.forEach((voyage) => {
    const coordinates = locationToCoordinates[voyage.location];
    if (coordinates) {
      addMarker(coordinates, {
        color: getColorByRating(voyage.rating),
        popup: createPopupContent(voyage),
      });
    }
  });

  // Center on first voyage if available
  if (Voyages.length > 0 && locationToCoordinates[Voyages[0].location]) {
    flyTo(locationToCoordinates[Voyages[0].location], 4);
  }
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

function getColorByRating(rating: number): string {
  const colors = [
    "#ff0000", // 1 star - red
    "#ff6600", // 2 stars - orange
    "#ffcc00", // 3 stars - yellow
    "#99cc00", // 4 stars - light green
    "#006e63", // 5 stars - your accent color
  ];
  return colors[Math.min(Math.max(rating - 1, 0), colors.length - 1)];
}

function createPopupContent(voyage: VoyageTypeInfo): string {
  return `
    <div class="max-w-xs">
      <h3 class="font-bold text-lg">${voyage.title}</h3>
      <p class="text-sm">${voyage.location}</p>
      <p class="text-sm mt-1">${voyage.date.toLocaleDateString()}</p>
      <div class="flex mt-1">
        ${Array(voyage.rating)
          .fill('<span class="text-yellow-500">★</span>')
          .join("")}
        ${Array(5 - voyage.rating)
          .fill('<span class="text-gray-300">★</span>')
          .join("")}
      </div>
      ${
        voyage.imageUrl
          ? `<img src="${voyage.imageUrl}" class="mt-2 w-full h-20 object-cover rounded">`
          : ""
      }
    </div>
  `;
}
</script>
