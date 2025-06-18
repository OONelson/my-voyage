<template>
  <article class="flex flex-col items-center gap-4 mt-5">
    <div>
      <USkeleton class="h-[200px] w-[300px] base rounded-md bg-skeleton mb-2" />

      <div class="grid gap-2">
        <USkeleton class="h-4 w-10 base bg-skeleton" />
        <USkeleton class="h-4 w-full base bg-skeleton" />
        <USkeleton class="h-4 w-10 base bg-skeleton" />
        <USkeleton class="h-4 w-full base bg-skeleton" />
        <USkeleton class="h-4 w-10 base bg-skeleton" />
        <USkeleton class="h-4 w-full base bg-skeleton" />
        <div class="flex justify-start items-center gap-2">
          <USkeleton class="h-4 w-4 base bg-skeleton" />
          <USkeleton class="h-4 w-4 base bg-skeleton" />
          <USkeleton class="h-4 w-4 base bg-skeleton" />
          <USkeleton class="h-4 w-4 base bg-skeleton" />
          <USkeleton class="h-4 w-4 base bg-skeleton" />
        </div>
        <USkeleton class="h-[220px] mt-3 w-full base bg-skeleton" />
      </div>

      <USkeleton class="h-20 mt-10 w-[270px] base bg-skeleton" />
    </div>
  </article>
</template>
