<template>
  <main>
    <h3 class="mb-5 px-2 border-b text-textblack100">voyages</h3>

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
          <h4 class="text-textblack100 font-medium">{{ voyage.title }}</h4>
          <VerticalThreeDots fillColor="textblack100" />
        </div>
        <p>{{ voyage.location }} • {{ formatDate(voyage.date) }}</p>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { MergedVoyages as mergedVoyagesData } from "../constants/constant";
import VerticalThreeDots from "@/assets/icons/VerticalThreeDots.vue";

const router = useRouter();

const MergedVoyages = ref(mergedVoyagesData);
const navigateToVoyage = (id) => {
  router.push(`/voyages/${id}`);
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<style scoped></style>
