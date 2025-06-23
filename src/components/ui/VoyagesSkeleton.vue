<template>
  <section class="flex flex-col justify-center items-center">
    <article class="rounded-lg p-2 my-2 bg-white shadow-md w-full sm:w-[500px]">
      <!-- Image Skeleton -->
      <div class="relative">
        <USkeleton class="h-[200px] w-full rounded-md bg-skeleton" />
        <div
          class="absolute right-2 top-2 bg-white/90 rounded-full h-8 w-8 flex justify-center items-center"
        >
          <USkeleton class="h-5 w-5 rounded-full bg-skeleton" />
        </div>
      </div>

      <!-- Content Skeleton -->
      <div class="flex justify-between items-center mt-2">
        <USkeleton class="h-6 w-3/4 bg-skeleton rounded" />
        <USkeleton class="h-5 w-5 bg-skeleton rounded" />
      </div>

      <!-- Location/Date Skeleton -->
      <USkeleton class="h-4 w-full mt-2 bg-skeleton rounded" />
      <USkeleton class="h-4 w-2/3 mt-1 bg-skeleton rounded" />

      <!-- Created At Skeleton -->
      <div class="mt-2">
        <USkeleton class="h-4 w-1/4 inline-block bg-skeleton rounded" />
        <USkeleton class="h-4 w-2/5 inline-block ml-1 bg-skeleton rounded" />
      </div>

      <!-- Rating Skeleton -->
      <div class="mt-3 pt-3 border-t">
        <div class="flex items-center">
          <div class="flex mr-2">
            <SkeletonStarIcon
              v-for="i in 5"
              :key="i"
              class="h-4 w-4 mr-1 bg-skeleton rounded-sm"
            />
          </div>
          <USkeleton class="h-4 w-20 bg-skeleton rounded" />
        </div>
      </div>
    </article>
  </section>
</template>
<script setup lang="ts">
import SkeletonStarIcon from "@/assets/icons/SkeletonStarIcon.vue";
</script>
