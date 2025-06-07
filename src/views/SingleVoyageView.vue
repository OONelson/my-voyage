<template>
  <main class="max-w-[800px] my-2 mx-auto px-3" v-if="voyage">
    <article class="rounded-lg p-2 my-2 bg-white shadow-md">
      <img
        v-if="voyage.imageUrl"
        :src="voyage.imageUrl"
        :alt="voyage.title"
        class="rounded-md"
      />
      <div class="flex justify-between items-center">
        <h4 class="text-textblack100 font-medium">{{ voyage.title }}</h4>
        <VerticalThreeDots fillColor="textblack100" />
      </div>
      <p>{{ voyage.location }} • {{ formatDate(voyage.date) }}</p>

      <div class="mt-3 pt-3 border-t text-sm text-gray-500">
        <Rating :rating="voyage.rating" show-comment />
      </div>
    </article>
    <div class="bg-[#f8f8f8] rounded-lg p-2 mb-2">
      <h3>Notes</h3>
      <p>{{ voyage.notes }}</p>
    </div>
    <router-link to="/voyages" class="flex items-center">
      <ArrowBack fillColor="#498a80" />
      <span class="text-accent50"> Back to Voyages </span>
    </router-link>
  </main>
  <div v-else>
    <p>Loading voyage...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { MergedVoyages } from "@/constants/constant.ts";
import VerticalThreeDots from "../assets/icons/VerticalThreeDots.vue";
import ArrowBack from "../assets/icons/ArrowBack.vue";

const route = useRoute();
const voyage = ref(null);

onMounted(() => {
  const voyageId = Number(route.params.id);
  voyage.value = MergedVoyages.value.find((v) => v.id === voyageId);
});

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped></style>
