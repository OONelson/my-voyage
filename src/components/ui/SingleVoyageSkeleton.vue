<template>
  <article class="flex flex-col items-center gap-4 mt-5">
    <div>
      <USkeleton class="h-[200px] w-[300px] base rounded-md bg-skeleton mb-2" />

      <div class="grid gap-2">
        <div class="flex justify-between items-center gap-20">
          <USkeleton class="h-4 w-[200px] base bg-skeleton" />
          <USkeleton class="h-4 w-[8px] base bg-skeleton" />
        </div>
        <USkeleton class="h-4 w-full base bg-skeleton" />
        <USkeleton class="h-4 w-[250px] base bg-skeleton" />
        <USkeleton class="h-4 mt-3 w-[270px] base bg-skeleton" />
      </div>

      <USkeleton class="h-20 mt-10 w-[270px] base bg-skeleton" />
    </div>

    <div class="map-skeleton animate-pulse">
      <div class="skeleton-container">
        <!-- Map area skeleton -->
        <div class="map-area bg-skeleton rounded-lg"></div>

        <!-- Controls skeleton -->
        <div class="controls flex gap-2 mt-2">
          <div class="control-button rounded-full w-8 h-8 bg-skeleton"></div>
          <div class="control-button rounded-full w-8 h-8 bg-skeleton"></div>
          <div class="zoom-controls flex flex-col gap-1 ml-auto bg-skeleton">
            <div class="zoom-button rounded w-8 h-8 bg-skeleton"></div>
            <div class="zoom-button rounded w-8 h-8 bg-skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
<style scoped>
.map-skeleton {
  margin-top: 30px;
  width: 100%;
  height: 400px;
}

.map-area {
  width: 100%;
  height: 85%;
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
</style>
