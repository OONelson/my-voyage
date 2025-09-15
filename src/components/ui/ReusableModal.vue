<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
          @click="closeModal"
        ></div>

        <!-- Modal Content -->
        <div
          class="relative w-full max-w-md mx-auto bg-white dark:bg-dark-background100 rounded-lg shadow-xl dark:shadow-2xl border dark:border-dark-border100 transform transition-all"
          :class="modalClass"
        >
          <!-- Header -->
          <div
            v-if="title || $slots.header"
            class="px-6 py-4 border-b border-gray-200 dark:border-dark-border100"
          >
            <div class="flex items-center justify-between">
              <slot name="header">
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-dark-textblack200"
                >
                  {{ title }}
                </h3>
              </slot>
              <button
                v-if="showCloseButton"
                @click="closeModal"
                class="text-gray-400 dark:text-dark-textblack50 hover:text-gray-600 dark:hover:text-dark-textblack100 focus:outline-none focus:ring-2 focus:ring-accent200 dark:focus:ring-dark-accent200 rounded-md p-1 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="px-6 py-4">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="px-6 py-4 border-t border-gray-200 dark:border-dark-border100 bg-gray-50 dark:bg-dark-background200 rounded-b-lg"
          >
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean;
  title?: string;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  modalClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showCloseButton: true,
  closeOnOutsideClick: true,
});

const emit = defineEmits<{
  close: [];
}>();

const closeModal = () => {
  if (props.closeOnOutsideClick) {
    emit("close");
  }
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

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9) translateY(-10px);
}
</style>
