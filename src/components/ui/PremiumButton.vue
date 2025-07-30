<template>
  <button
    class="premium-button relative overflow-hidden group"
    :class="{ 'premium-active': isPremium, 'premium-inactive': !isPremium }"
    :disabled="!isPremium"
    @click="handleClick"
  >
    <!-- Shine effect -->
    <span class="shine absolute top-0 left-0 w-full h-full"></span>

    <!-- Main content -->
    <span class="relative z-10 flex items-center justify-center gap-2">
      <span v-if="isPremium" class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      </span>
      <span class="text">{{ label }}</span>
    </span>

    <!-- Tooltip for non-premium users -->
    <div v-if="!isPremium" class="premium-tooltip">
      Upgrade to Premium to unlock this feature
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps({
  isPremium: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    default: "Premium Feature",
  },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  if (this.isPremium) {
    emit("click");
  }
};
</script>

<style scoped></style>
