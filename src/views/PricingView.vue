<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1
          class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
        >
          Choose Your Plan
        </h1>
        <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Select the plan that works best for your needs
        </p>
      </div>

      <!-- Success Message -->
      <div
        v-if="showSuccess"
        class="max-w-md mx-auto mb-8 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded"
        role="alert"
      >
        <p class="font-bold">🎉 Success!</p>
        <p>Your subscription is now active. Enjoy your premium features!</p>
      </div>

      <!-- Pricing Plans -->
      <div
        class="mt-16 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8"
      >
        <!-- Free Plan -->
        <div
          class="relative bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-200"
        >
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">Free</h2>
            <p class="mt-4 text-sm text-gray-500">
              Basic features to get started
            </p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900">$0</span>
              <span class="text-base font-medium text-gray-500">/forever</span>
            </p>
            <button
              @click="handlePlanSelection(plans[0])"
              :disabled="isCurrentPlan(plans[0])"
              :class="[
                'mt-8 block w-full py-3 px-6 border border-gray-800 rounded-md text-center font-medium',
                isCurrentPlan(plans[0])
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-800 hover:bg-gray-50',
              ]"
            >
              {{ getButtonText(plans[0]) }}
            </button>
          </div>
          <div class="pt-6 pb-8 px-6">
            <h3
              class="text-xs font-medium text-gray-900 tracking-wide uppercase"
            >
              What's included
            </h3>
            <ul class="mt-6 space-y-4">
              <li
                v-for="feature in plans[0].features"
                :key="feature"
                class="flex"
              >
                <svg
                  class="flex-shrink-0 h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3 text-base text-gray-500">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Premium Monthly (Featured) -->
        <div
          class="relative bg-white border-2 border-blue-500 rounded-2xl shadow-sm divide-y divide-gray-200"
        >
          <div
            class="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg uppercase tracking-wide"
          >
            Popular
          </div>
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">Premium</h2>
            <p class="mt-4 text-sm text-gray-500">
              For professionals who need more power
            </p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900">$9</span>
              <span class="text-base font-medium text-gray-500">/month</span>
            </p>
            <button
              @click="handlePlanSelection(plans[1])"
              :disabled="isCurrentPlan(plans[1])"
              :class="[
                'mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium',
                isCurrentPlan(plans[1])
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700',
              ]"
            >
              {{ getButtonText(plans[1]) }}
            </button>
          </div>
          <div class="pt-6 pb-8 px-6">
            <h3
              class="text-xs font-medium text-gray-900 tracking-wide uppercase"
            >
              What's included
            </h3>
            <ul class="mt-6 space-y-4">
              <li
                v-for="feature in plans[1].features"
                :key="feature"
                class="flex"
              >
                <svg
                  class="flex-shrink-0 h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3 text-base text-gray-500">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Premium Yearly -->
        <div
          class="relative bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-200"
        >
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">Premium</h2>
            <p class="mt-4 text-sm text-gray-500">Best value - save 20%</p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900">$90</span>
              <span class="text-base font-medium text-gray-500">/year</span>
            </p>
            <button
              @click="handlePlanSelection(plans[2])"
              :disabled="isCurrentPlan(plans[2])"
              :class="[
                'mt-8 block w-full py-3 px-6 border border-blue-600 rounded-md text-center font-medium',
                isCurrentPlan(plans[2])
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50',
              ]"
            >
              {{ getButtonText(plans[2]) }}
            </button>
          </div>
          <div class="pt-6 pb-8 px-6">
            <h3
              class="text-xs font-medium text-gray-900 tracking-wide uppercase"
            >
              What's included
            </h3>
            <ul class="mt-6 space-y-4">
              <li
                v-for="feature in plans[2].features"
                :key="feature"
                class="flex"
              >
                <svg
                  class="flex-shrink-0 h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3 text-base text-gray-500">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-24">
        <h2 class="text-3xl font-extrabold text-gray-900 text-center">
          Frequently asked questions
        </h2>
        <div class="mt-12 max-w-3xl mx-auto divide-y divide-gray-200">
          <div v-for="(faq, index) in faqs" :key="index" class="py-6">
            <h3 class="text-lg font-medium text-gray-900">
              {{ faq.question }}
            </h3>
            <p class="mt-2 text-base text-gray-500">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { createCheckoutSession } from "../services/supabase/subscriptions";

const router = useRouter();
const { user } = useAuth();

const plans = ref([
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic features to get started",
    features: ["Basic analytics", "Limited templates", "Community support"],
    featured: false,
  },
  {
    id: "premium_monthly",
    name: "Premium",
    price: "$9",
    period: "per month",
    description: "For professionals who need more power",
    features: [
      "Advanced analytics",
      "Unlimited templates",
      "Priority support",
      "API access",
      "Premium content",
    ],
    featured: true,
  },
  {
    id: "premium_yearly",
    name: "Premium",
    price: "$90",
    period: "per year",
    description: "Best value - save 20%",
    features: [
      "Everything in Premium Monthly",
      "Annual discount",
      "Exclusive yearly content",
    ],
    featured: false,
  },
]);

const faqs = ref([
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time.",
  },
  {
    question: "Do you offer discounts for teams?",
    answer:
      "We offer special pricing for teams of 5 or more. Contact us for details.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards and PayPal.",
  },
  {
    question: "How can I cancel my subscription?",
    answer:
      "You can cancel anytime from your account settings with no penalty.",
  },
]);

const loadingPlan = ref<string | null>(null);
const showSuccess = ref(false);

onMounted(() => {
  // Check for success query param
  if (router.currentRoute.value.query.success) {
    showSuccess.value = true;
    setTimeout(() => (showSuccess.value = false), 5000);
  }
});

const isCurrentPlan = (plan: any) => {
  if (!user.value) return false;
  if (plan.id === "free" && !user.value.profile?.is_premium) return true;
  return false;
};

const getButtonText = (plan: any) => {
  if (isCurrentPlan(plan)) return "Current Plan";
  if (loadingPlan.value === plan.id) return "Processing...";
  return plan.id === "free" ? "Continue with Free" : "Upgrade Now";
};

const handlePlanSelection = async (plan: any) => {
  if (plan.id === "free") {
    router.push("/");
    return;
  }

  try {
    loadingPlan.value = plan.id;
    const { url } = await createCheckoutSession(plan.id);
    if (url) {
      window.location.href = url;
    }
  } catch (error) {
    console.error("Subscription error:", error);
  } finally {
    loadingPlan.value = null;
  }
};
</script>
