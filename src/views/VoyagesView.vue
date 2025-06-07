<template>
  <main>
    <h3 class="mb-5 px-2 border-b text-textblack100 bg-white shadow-sm">
      voyages
    </h3>

    <section class="px-3 flex flex-col justify-center items-center">
      <article
        v-for="voyage in MergedVoyages"
        :key="voyage.id"
        class="rounded-lg p-2 my-2 bg-white shadow-md"
        @click="navigateToVoyage(voyage.id)"
      >
        <img
          v-if="voyage.imageUrl"
          :src="voyage.imageUrl"
          :alt="voyage.title"
          class="rounded-md"
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { MergedVoyages as mergedVoyagesData } from "../constants/constant";
import VerticalThreeDots from "@/assets/icons/VerticalThreeDots.vue";
import Rating from "@/components/Rating.vue";

const router = useRouter();

const MergedVoyages = ref(mergedVoyagesData);
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
</script>

<style scoped></style>
