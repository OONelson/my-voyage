<template>
  <button
    class="relative w-full flex justify-center items-center gap-4 px-4 py-1.5 border border-transparent rounded-md shadow-sm text-white bg-accent100 hover:bg-accent200 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
    :class="{
      'bg-accent100 border border-accent50': isPremium,
      'bg-accent30 hover:bg-accent30 ': !isPremium,
    }"
    :disabled="!isPremium"
    @click="handleClick"
  >
    <!-- Main content -->
    <div class="z-10 flex items-center justify-center gap-2">
      <div v-if="!isPremium" class="absolute top-1 left-0">
        <PremiumIcon fillColor="#f0d90c" />
      </div>
      <span class="text">{{ label }}</span>
    </div>

    <!-- Tooltip for non-premium users -->
    <div
      v-if="!isPremium"
      class="absolute z-20 w-48 p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
    >
      Upgrade to Premium to unlock this feature
      <div
        class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"
      ></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import PremiumIcon from "@/assets/icons/PremiumIcon.vue";

const props = defineProps({
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
  if (props.isPremium) {
    emit("click");
  }
};
</script>

<style scoped></style>
