<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div
      class="w-full max-w-md text-center"
      :class="isVisible ? 'animate-fade-in' : 'opacity-0'"
    >
      <div class="flex justify-center items-center mb-8">
        <Logo />
        <h2 class="text-sm font-medium text-muted-foreground">Zende</h2>
      </div>

      <h1 class="text-3xl font-semibold text-foreground mb-12">
        Payment successful!
      </h1>

      <div class="mb-16 flex justify-center">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="animate-check-bounce"
        >
          <path
            d="M20 42L32 54L60 26"
            stroke="#005b52"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="animate-check-draw"
            :style="{
              strokeDasharray: 100,
              strokeDashoffset: 100,
            }"
          />
        </svg>
      </div>

      <button
        @click="goToHome"
        class="px-4 py-2 bg-accent100 text-white hover:bg-accent200/90 text-base font-medium rounded-lg transition-colors"
      >
        Start using premium
      </button>
    </div>
  </div>
</template>

<script setup>
import Logo from "@/assets/icons/Logo.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isVisible = ref(false);

onMounted(() => {
  isVisible.value = true;
});

const goToHome = () => {
  router.push("/voyages");
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-check-bounce {
  animation: checkBounce 0.6s ease-out 0.4s both;
}

.animate-check-draw {
  animation: checkDraw 0.8s ease-out 0.8s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes checkDraw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
