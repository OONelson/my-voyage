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
    <div class="relative z-10 flex items-center justify-center gap-2">
      <div v-if="!isPremium" class="absolute -top-2 -left-[4.2rem]">
        <PremiumIcon fillColor="#f0d90c" />
      </div>
      <span class="text">{{ label }}</span>
    </div>

    <!-- Tooltip for non-premium users -->
    <div v-if="!isPremium" class="premium-tooltip">
      Upgrade to Premium to unlock this feature
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
