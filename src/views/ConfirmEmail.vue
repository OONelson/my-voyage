<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <div v-if="!confirmed">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Confirm Your Email</h1>
      <p class="text-gray-600 mb-6">
        We've sent a confirmation link to
        <span class="font-semibold">{{ email }}</span
        >. Please check your inbox and click the link to verify your account.
      </p>

      <div
        v-if="successMessage"
        class="mb-4 p-3 bg-green-100 text-green-700 rounded"
      >
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ errorMessage }}
      </div>

      <button
        @click="resendConfirmation"
        :disabled="isLoading || resendCooldown > 0"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Sending...</span>
        <span v-else-if="resendCooldown > 0"
          >Resend in {{ resendCooldown }}s</span
        >
        <span v-else>Resend Confirmation Email</span>
      </button>
    </div>

    <div v-else class="text-center">
      <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
      <h2 class="mt-3 text-lg font-medium text-gray-900">Email Confirmed!</h2>
      <p class="mt-2 text-sm text-gray-500">
        Your email address has been successfully verified.
      </p>
      <router-link
        to="/dashboard"
        class="mt-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Go to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/composables/useAuth";
// import { CheckCircleIcon } from "@heroicons/vue/outline";

const route = useRoute();
const router = useRouter();

const { redirectBasedOnAuth } = useAuth();

const email = ref((route.query.email as string) || "");
const isLoading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const confirmed = ref(false);
const resendCooldown = ref(0);

// Check if email is already confirmed
onMounted(async () => {
  if (!email.value) {
    // Try to get email from current session if not in URL
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email) {
      email.value = user.email;
    } else {
      router.push("/signup");
      return;
    }
  }

  // Check if email is already confirmed
  await checkConfirmationStatus();
});

// Check confirmation status periodically
let checkInterval: number;
onMounted(() => {
  checkInterval = window.setInterval(checkConfirmationStatus, 5000);
});

const checkConfirmationStatus = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.email_confirmed_at) {
    confirmed.value = true;
    clearInterval(checkInterval);
    redirectBasedOnAuth();
  }
};

const resendConfirmation = async () => {
  isLoading.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.value,
    });

    if (error) throw error;

    successMessage.value = "Confirmation email resent successfully!";
    startCooldownTimer();
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Failed to resend confirmation email";
  } finally {
    isLoading.value = false;
  }
};

const startCooldownTimer = () => {
  resendCooldown.value = 30; // 30 seconds cooldown
  const timer = setInterval(() => {
    resendCooldown.value -= 1;
    if (resendCooldown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};
</script>
