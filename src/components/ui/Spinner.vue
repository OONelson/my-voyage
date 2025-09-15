<template>
  <div class="flex items-center justify-center">
    <div
      class="animate-spin rounded-full h-6 w-6 border-b-2 border-accent200 dark:border-dark-accent200"
      :class="sizeClass"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineOptions({
  name: "UiSpinner",
});

interface Props {
  size?: "sm" | "md" | "lg" | "xl";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const sizeClass = computed(() => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };
  return sizes[props.size];
});
</script>
