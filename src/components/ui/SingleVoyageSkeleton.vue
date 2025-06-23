<template>
  <section
    class="flex flex-col lg:flex-row justify-between items-start gap-8 xl:gap-[5rem] w-full mt-10 lg:px-[15rem] sm:px-5"
  >
    <!-- Left Column (Voyage Content) -->
    <div class="w-full lg:w-[55%] xl:w-[65%]">
      <!-- Main Card Skeleton -->
      <div
        class="rounded-lg p-4 bg-white shadow-md lg:min-w-[500px] xl:min-w-[600px] mb-4"
      >
        <!-- Image Skeleton -->
        <div class="relative">
          <div
            class="h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full rounded-md bg-skeleton"
          ></div>
          <div
            class="absolute right-3 top-3 bg-white/90 rounded-full h-8 w-8 flex justify-center items-center"
          >
            <div class="h-5 w-5 rounded-full bg-skeleton"></div>
          </div>
        </div>

        <!-- Title and Menu -->
        <div class="flex justify-between items-center pt-4">
          <div class="h-6 w-3/4 bg-skeleton rounded"></div>
          <div class="h-5 w-5 bg-skeleton rounded"></div>
        </div>

        <!-- Location and Date -->
        <div class="h-4 w-full mt-3 bg-skeleton rounded"></div>

        <!-- Created At -->
        <div class="mt-2">
          <div class="h-4 w-1/4 inline-block bg-skeleton rounded"></div>
          <div class="h-4 w-2/5 inline-block ml-2 bg-skeleton rounded"></div>
        </div>

        <!-- Rating -->
        <div class="mt-4 pt-3 border-t">
          <div class="flex items-center">
            <div class="flex mr-2">
              <SkeletonStarIcon
                v-for="i in 5"
                :key="i"
                class="h-4 w-4 mr-1 bg-skeleton rounded-sm"
              />
            </div>
            <div class="h-4 w-24 bg-skeleton rounded"></div>
          </div>
        </div>
      </div>

      <!-- Notes Skeleton -->
      <div class="bg-[#f8f8f8] rounded-lg p-4">
        <div class="h-5 w-1/4 bg-skeleton rounded mb-3"></div>
        <div class="h-4 w-full bg-skeleton rounded mb-2"></div>
        <div class="h-4 w-3/4 bg-skeleton rounded mb-2"></div>
        <div class="h-4 w-5/6 bg-skeleton rounded"></div>
      </div>
    </div>

    <!-- Right Column (Map) -->
    <div
      class="w-full lg:w-[60%] xl:w-[35%] h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[550px] bg-skeleton rounded-lg"
    >
      <!-- Map controls skeleton -->
      <div class="absolute bottom-4 right-4 flex flex-col gap-2">
        <div class="rounded-full w-8 h-8 bg-skeleton"></div>
        <div class="rounded-full w-8 h-8 bg-skeleton"></div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import SkeletonStarIcon from "../../assets/icons/SkeletonStarIcon.vue";
</script>

<style scoped>
.map-skeleton {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .map-skeleton {
    height: 350px;
  }
}

@media (min-width: 768px) {
  .map-skeleton {
    height: 400px;
  }
}

@media (min-width: 1024px) {
  .map-skeleton {
    height: 100%;
    min-height: 400px;
  }
}
</style>
