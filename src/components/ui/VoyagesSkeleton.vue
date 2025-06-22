<template>
  <article class="flex flex-col items-center gap-4 mt-5 xl:max-w-[500px]">
    <div>
      <USkeleton
        class="h-[200px] w-[300px] sm:min-h-[250px] sm:min-w-[350px] md:min-h-[230px] lg:w-[400px] lg:min-h-[300px] lg:max-h-[350px] xl:min-h-[350px] xl:w-[500px] base rounded-md bg-skeleton mb-2"
      />

      <div class="grid gap-2">
        <div class="flex justify-between items-center gap-20">
          <USkeleton class="h-4 w-[200px] base bg-skeleton" />
          <USkeleton class="h-4 w-[8px] base bg-skeleton" />
        </div>
        <USkeleton class="h-4 w-full base bg-skeleton" />
        <USkeleton class="h-4 w-[250px] base bg-skeleton" />

        <div class="flex justify-start items-center gap-4 mt-6">
          <div
            class="relative flex justify-between items-center gap-2 w-[120px]"
          >
            <SkeletonStarIcon />
            <SkeletonStarIcon />
            <SkeletonStarIcon />
            <SkeletonStarIcon />
            <SkeletonStarIcon />
          </div>
          <USkeleton class="h-4 lg:w-[140px] xl:w-[170px] base bg-skeleton" />
        </div>
      </div>

      <!-- <USkeleton class="h-20 mt-10 w-[270px] base bg-skeleton" /> -->
    </div>
  </article>
</template>
<script setup lang="ts">
import SkeletonStarIcon from "@/assets/icons/SkeletonStarIcon.vue";
</script>
