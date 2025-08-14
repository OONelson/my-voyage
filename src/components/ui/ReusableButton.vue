<template>
  <UButton
    :variant="variant"
    :color="color"
    :loading="loading"
    :disabled="disabled"
    :icon="icon"
    @click="handleClick"
    class="px-4 py-1 text-buttonLightcolor cursor-pointer"
  >
    {{ label }}
    <template v-if="$slots.icon">
      <slot name="icon" />
    </template>
  </UButton>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
  onClick?: () => void;
  variant?: "ghost" | "link" | "solid" | "outline" | "soft" | "subtle";
  label?: string;
  icon?: string;
  disabled?: boolean;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "error"
    | "neutral";
}>();

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

function handleClick(event: MouseEvent) {
  emit("click", event);
}
</script>
