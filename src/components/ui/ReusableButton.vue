<template>
  <UButton
    :variant="variant"
    :color="color"
    :loading="loading"
    :disabled="disabled"
    :icon="icon"
    @click="handleClick"
    class="px-4 py-1 text-background"
  >
    {{ label }}
    <template v-if="$slots.icon">
      <slot name="icon" />
    </template>
  </UButton>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "Button",
  },
  variant: {
    type: String as PropType<"solid" | "outline" | "ghost" | "link">,
    default: "solid",
  },
  color: {
    type: String as PropType<
      | "primary"
      | "secondary"
      | "success"
      | "info"
      | "warning"
      | "error"
      | "neutral"
    >,
    default: "primary",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

function handleClick(event: MouseEvent) {
  emit("click", event);
}
</script>
