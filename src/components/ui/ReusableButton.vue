<template>
  <button
    :type="type"
    :disabled="disabled"
    class="relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent200 dark:focus:ring-dark-accent200 dark:focus:ring-offset-dark-background100 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[buttonClasses, disabled && 'opacity-50 cursor-not-allowed']"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "button",
  variant: "primary",
  size: "md",
  disabled: false,
  loading: false,
  fullWidth: false,
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => {
  const baseClasses =
    "px-4 py-1 text-buttonLightcolor dark:text-dark-buttonLightcolor cursor-pointer";

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary:
      "bg-accent200 dark:bg-dark-accent200 text-white hover:bg-accent300 dark:hover:bg-dark-accent300 border border-accent200 dark:border-dark-accent200 rounded-lg",
    secondary:
      "bg-gray-100 dark:bg-dark-background200 text-gray-700 dark:text-dark-textblack100 hover:bg-gray-200 dark:hover:bg-dark-inputColor100 border border-gray-200 dark:border-dark-border100 rounded-lg",
    outline:
      "bg-transparent border border-gray-300 dark:border-dark-border100 text-gray-700 dark:text-dark-textblack100 hover:bg-gray-50 dark:hover:bg-dark-background200 rounded-lg",
    danger:
      "bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800 border border-red-600 dark:border-red-700 rounded-lg",
    success:
      "bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800 border border-green-600 dark:border-green-700 rounded-lg",
  };

  const widthClass = props.fullWidth ? "w-full" : "";

  return `${baseClasses} ${sizeClasses[props.size]} ${
    variantClasses[props.variant]
  } ${widthClass}`;
});
</script>
