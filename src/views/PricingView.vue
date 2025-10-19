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
                'mt-8 block w-full py-3 px-6 border border-accent50 rounded-md text-center font-medium',
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
                  class="flex-shrink-0 h-5 w-5 text-accent100"
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
          class="relative bg-white border-2 border-accent100 rounded-2xl shadow-sm divide-y divide-gray-200"
        >
          <div
            class="absolute top-0 right-0 bg-accent100 text-white px-4 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg uppercase tracking-wide"
          >
            Popular
          </div>
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">Premium</h2>
            <p class="mt-4 text-sm text-gray-500">
              For professionals who need more power
            </p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900">$6</span>
              <span class="text-base font-medium text-gray-500">/month</span>
            </p>
            <button
              @click="handlePlanSelection(plans[1])"
              :disabled="isCurrentPlan(plans[1])"
              :class="[
                'mt-8 block w-full py-3 px-6 border border-accent50 rounded-md text-center font-medium',
                isCurrentPlan(plans[1])
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-accent100 text-white hover:bg-accent50',
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
                  class="flex-shrink-0 h-5 w-5 text-accent50"
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
              <span class="text-4xl font-extrabold text-gray-900">$60</span>
              <span class="text-base font-medium text-gray-500">/year</span>
            </p>
            <button
              @click="handlePlanSelection(plans[2])"
              :disabled="isCurrentPlan(plans[2])"
              :class="[
                'mt-8 block w-full py-3 px-6 border border-accent50 rounded-md text-center font-medium',
                isCurrentPlan(plans[2])
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'text-accent100 hover:bg-blue-50',
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
                  class="flex-shrink-0 h-5 w-5 text-accent50"
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
      <div class="w-full max-w-3xl mx-auto">
        <h4 class="text-2xl font-bold text-gray-900 mt-10 mb-2">
          Travel Journal FAQs
        </h4>
        <p class="text-gray-600 mb-5">
          Find answers to common questions about our travel journal plans and
          features.
        </p>
        <div class="mt-5 max-w-3xl mx-auto divide-y divide-gray-200">
          <div v-for="(faq, index) in faqs" :key="index" class="py-2">
            <h3 class="text-lg font-medium text-gray-900">
              {{ faq.question }}
            </h3>
            <p class="mt-2text-gray-500">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
// import { createCheckoutSession } from "../services/supabase/subscriptions";
import { usePremium } from "@/composables/usePremium";

const router = useRouter();
const { upgradeUser } = usePremium();

const { user } = useAuth();

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: string;
};

const plans = ref<Plan[]>([
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic features to get started with travel journaling",
    features: [
      "1 image per voyage entry",
      "Up to 2 pinned locations per voyage entry",
      "Maximum 10 voyage entries",
    ],
    featured: false,
    priceId: null,
  },
  {
    id: "premium_monthly",
    name: "Premium",
    price: "$6",
    period: "per month",
    description: "Enhanced features for those who love traveling",
    features: [
      "Up to 8 images per travel entry",
      "Unlimited pinned locations",
      "Up to 50 travel entries",
      "Advanced travel statistics",
      "Export to PDF feature",
    ],
    featured: true,
    priceId: "price_your_monthly_price_id_here",
  },
  {
    id: "premium_yearly",
    name: "Premium",
    price: "$60",
    period: "per year",
    description: "Best value - save 20%",
    features: [
      "Everything in Premium Monthly",
      "Annual discount",
      "Exclusive yearly content",
    ],
    featured: false,
    priceId: "price_your_yearly_price_id_here",
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

const isCurrentPlan = (plan: Plan) => {
  if (!user.value) return false;
  if (plan.id === "free" && !user.value?.is_premium) return true;
  return false;
};

const getButtonText = (plan: Plan) => {
  if (isCurrentPlan(plan)) return "Current Plan";
  if (loadingPlan.value === plan.id) return "Processing...";
  return plan.id === "free" ? "Continue with Free" : "Upgrade Now";
};

const handlePlanSelection = async (plan: Plan) => {
  if (plan.id === "free") {
    router.push("/");
    return;
  }

  try {
    loadingPlan.value = plan.id;
    if (!plan.priceId) {
      throw new Error("Price ID not configured for this plan");
    }

    await upgradeUser(plan.priceId);
    user.value.is_premium = true;
    showSuccess.value = true;
  } catch (error) {
    console.error("Subscription error:", error);
  } finally {
    loadingPlan.value = null;
  }
};
</script>
