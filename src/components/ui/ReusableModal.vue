<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="fixed inset-0 bg-black bg-opacity-50"
        @click="closeModal"
      ></div>

      <div class="flex items-center justify-center min-h-screen p-4">
        <div
          class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto"
          :class="sizeClasses"
          @click.stop
        >
          <div
            v-if="title"
            class="flex justify-between items-center p-4 border-b"
          >
            <h3 class="text-lg font-semibold">{{ title }}</h3>
            <button
              @click="closeModal"
              class="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <span class="sr-only">Close</span>
              &times;
            </button>
          </div>

          <div class="p-4">
            <slot></slot>
          </div>

          <div v-if="useSlots().footer" class="p-4 border-t">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { PropType, computed, useSlots } from "vue";

const props = defineProps({
  isOpen: Boolean,
  title: String,
  size: {
    type: String as PropType<"sm" | "md" | "lg" | "xl">,
    default: "md",
  },
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const sizeClasses = computed(() => ({
  "max-w-sm": props.size === "sm",
  "max-w-md": props.size === "md",
  "max-w-lg": props.size === "lg",
  "max-w-xl": props.size === "xl",
}));

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
