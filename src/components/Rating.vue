<template>
  <div class="flex items-center">
    <div :class="[getRatingColor(rating), 'flex']">
      <span v-for="i in 5" :key="i">
        {{ i <= rating ? "★" : "☆" }}
      </span>
    </div>

    <span v-if="showComment" class="ml-2 text-sm text-textblack100 font-medium">
      {{ getRatingComment(rating) }}
    </span>
  </div>
</template>
<script setup lang="ts">
import type { Rating } from "../types/Voyage";
import { getRatingColor, getRatingComment } from "../utils/ratingUtils";

defineOptions({
  name: "VoyageRating",
});

defineProps<{
  rating: Rating;
  showComment?: boolean;
}>();
</script>
