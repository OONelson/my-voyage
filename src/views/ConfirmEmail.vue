<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <div v-if="!confirmed" class="text-center">
      <picture class="flex justify-center items-center">
        <img
          src="@/assets/images/Notification.svg"
          alt="notification-icon"
          class="w-[60%] mb-10"
        />
      </picture>
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
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent200 hover:bg-accent100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Sending...</span>
        <span v-else-if="resendCooldown > 0"
          >Resend in {{ resendCooldown }}s</span
        >
        <span v-else>Resend Confirmation Email</span>
      </button>
    </div>

    <div v-else class="text-center">
      <picture class="flex justify-center items-center">
        <img
          src="@/assets/images/Done.svg"
          alt="confirmed-icon"
          class="w-[60%]"
        />
      </picture>
      <h2 class="mt-3 text-lg font-medium text-gray-900">Email Confirmed!</h2>
      <p class="mt-2 text-normal text-gray-500">
        Your email address has been successfully verified.
      </p>
      <router-link
        to="/voyages"
        class="mt-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent200 hover:bg-accent100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent30"
      >
        Go to Voyages
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/composables/useAuth";

const route = useRoute();
const router = useRouter();
const { redirectBasedOnAuth } = useAuth();

const email = ref((route.query.email as string) || "");
const isLoading = ref<boolean>(false);
const successMessage = ref<string>("");
const errorMessage = ref<string>("");
const confirmed = ref<boolean>(false);
const resendCooldown = ref<number>(0);

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
    // First get the current user to check if they exist
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not found. Please sign up again.");
    }

    // Generate a confirmation URL (you might need to adjust this based on your auth flow)
    const confirmationUrl = `${window.location.origin}/auth/confirm?token=${user.id}&type=signup`;

    // Call our Supabase Edge Function to send email via Resend
    const { error } = await supabase.functions.invoke(
      "send-confirmation-email",
      {
        body: {
          email: email.value,
          confirmationUrl: confirmationUrl,
          name: user.user_metadata?.name || user.email?.split("@")[0],
        },
      }
    );

    if (error) throw error;

    successMessage.value = "Confirmation email sent successfully!";
    startCooldownTimer();
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Failed to send confirmation email";

    // Fallback to Supabase's built-in resend if Resend fails
    if (!errorMessage.value.includes("User not found")) {
      const { error: supabaseError } = await supabase.auth.resend({
        type: "signup",
        email: email.value,
      });
      if (!supabaseError) {
        successMessage.value = "Confirmation email sent via fallback method!";
        startCooldownTimer();
      }
    }
  } finally {
    isLoading.value = false;
  }
};

const startCooldownTimer = () => {
  resendCooldown.value = 30;
  const timer = setInterval(() => {
    resendCooldown.value -= 1;
    if (resendCooldown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};
</script>
