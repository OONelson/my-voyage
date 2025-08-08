<template>
  <section class="flex flex-col justify-center items-center px-4">
    <article
      class="rounded-lg p-2 my-2 bg-white shadow-md w-full max-w-[500px]"
    >
      <!-- Image Skeleton -->
      <div class="relative aspect-video">
        <USkeleton class="h-full w-full rounded-md bg-skeleton" />
        <div
          class="absolute right-2 top-2 bg-white/90 rounded-full h-8 w-8 flex justify-center items-center"
        >
          <USkeleton class="h-5 w-5 rounded-full bg-skeleton" />
        </div>
      </div>

      <!-- Content Skeleton -->
      <div class="flex justify-between items-center mt-3">
        <USkeleton class="h-6 w-3/4 bg-skeleton rounded" />
        <USkeleton class="h-5 w-5 bg-skeleton rounded" />
      </div>

      <!-- Location/Date Skeleton -->
      <div class="mt-3 space-y-2">
        <USkeleton class="h-4 w-full bg-skeleton rounded" />
        <USkeleton class="h-4 w-2/3 bg-skeleton rounded" />
      </div>

      <!-- Created At Skeleton -->
      <div class="mt-3 flex flex-wrap">
        <USkeleton class="h-4 w-1/4 bg-skeleton rounded" />
        <USkeleton class="h-4 w-2/5 ml-2 bg-skeleton rounded" />
      </div>

      <!-- Rating Skeleton -->
      <div class="mt-4 pt-3 border-t">
        <div class="flex flex-wrap items-center">
          <div class="flex mr-2 mb-1 sm:mb-0">
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
