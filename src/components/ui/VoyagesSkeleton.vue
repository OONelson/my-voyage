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
  </article>
</template>
