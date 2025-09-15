<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-3">
    <transition-group name="toast-fade" tag="div">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="min-w-[240px] max-w-xs px-4 py-3 rounded-md shadow-lg border text-sm flex items-start gap-2 cursor-pointer select-none transition-colors"
        :class="toastClass(t.type)"
        @click="removeToast(t.id)"
      >
        <span class="mt-0.5">{{ icon(t.type) }}</span>
        <p class="leading-5 flex-1">{{ t.message }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/composables/useToast";

const { toasts, removeToast } = useToast();

const icon = (type: string) => {
  switch (type) {
    case "success":
      return "✓";
    case "error":
      return "✕";
    case "warning":
      return "!";
    default:
      return "i";
  }
};

const toastClass = (type: string) => {
  const base =
    "border-gray-200 dark:border-dark-border100 bg-white dark:bg-dark-background100 text-gray-800 dark:text-dark-textblack200";
  const map: Record<string, string> = {
    success:
      "border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
    error:
      "border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
    warning:
      "border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
    info: "border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
  };
  return `${base} ${map[type] ?? ""}`;
};
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.2s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
