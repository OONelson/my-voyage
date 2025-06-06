<template>
  <main class="single-voyage" v-if="voyage">
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
    </article>
    <div class="notes">
      <h3>Notes</h3>
      <p>{{ voyage.notes }}</p>
    </div>
    <router-link to="/voyages" class="back-link">← Back to Voyages</router-link>
  </main>
  <div v-else>
    <p>Loading voyage...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { MergedVoyages } from "@/constants/constant.ts"; // Adjust import path

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

<style scoped>
.single-voyage {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.voyage-image {
  width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}
.meta {
  color: #666;
  font-size: 1.1rem;
}
.notes {
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 8px;
}
.back-link {
  display: inline-block;
  margin-top: 2rem;
  color: #42b983;
}
</style>
