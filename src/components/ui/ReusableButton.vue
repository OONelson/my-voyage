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
import type { PropType } from "vue";

const {
  loading,
  onClick = () => {},
  variant,
  label,
  icon,
  disabled,
} = withDefaults(
  defineProps<{
    loading?: boolean;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger" | "warning" | "ghost";
    label: string;
    icon?: () => void;
    disabled?: boolean;
  }>(),
  {
    loading: false,
    variant: "primary",
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

function handleClick(event: MouseEvent) {
  emit("click", event);
}
</script>
