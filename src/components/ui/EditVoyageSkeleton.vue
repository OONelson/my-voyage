<template>
  <article class="flex flex-col items-center gap-4 mt-10">
    <div>
      <USkeleton
        class="h-[200px] w-[300px] xl:w-[600px] base rounded-md bg-skeleton mb-6 mt-10"
      />

      <div class="grid gap-2">
        <USkeleton class="h-4 w-10 base mt-5 bg-skeleton" />
        <USkeleton class="h-8 w-full xl:w-[560px] base mt-3 bg-skeleton" />
        <USkeleton class="h-4 w-10 base mt-5 bg-skeleton" />
        <USkeleton class="h-8 w-full xl:w-[560px] base mt-3 bg-skeleton" />
        <USkeleton class="h-4 w-10 base mt-5 bg-skeleton" />
        <USkeleton class="h-8 w-full xl:w-[560px] base mt-3 bg-skeleton" />
        <USkeleton class="h-4 w-10 base mt-5 bg-skeleton" />
        <div class="flex justify-start items-center gap-2 mt-6 mb-3">
          <USkeleton class="h-4 w-4 base bg-skeleton" />
          <USkeleton class="h-4 w-4 base bg-skeleton" />
          <USkeleton class="h-4 w-4 base bg-skeleton" />
          <USkeleton class="h-4 w-4 base bg-skeleton" />
          <USkeleton class="h-4 w-4 base bg-skeleton" />
        </div>
        <USkeleton class="h-4 w-10 base mt-5 bg-skeleton" />
        <USkeleton class="h-[220px] mt-5 w-full base bg-skeleton" />
      </div>

      <div class="flex items-center justify-end gap-4 my-6">
        <USkeleton class="h-10 w-[70px] base bg-skeleton" />
        <USkeleton class="h-10 w-[100px] base bg-skeleton" />
      </div>
    </div>
  </article>
</template>
