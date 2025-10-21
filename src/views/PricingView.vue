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

      <div v-if="loadingPlans" class="text-center py-10">
        <span>Loading plans...</span>
      </div>
      <div v-else-if="errorPlans" class="text-center text-red-500 py-10">
        {{ errorPlans }}
      </div>
      <div
        v-else
        class="mt-16 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8"
      >
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="relative bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-200"
          :class="plan.featured ? 'border-2 border-accent100' : ''"
        >
          <div
            v-if="plan.featured"
            class="absolute top-0 right-0 bg-accent100 text-white px-4 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg uppercase tracking-wide"
          >
            Popular
          </div>
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">{{ plan.name }}</h2>
            <p class="mt-4 text-sm text-gray-500">{{ plan.description }}</p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900">
                ${{ plan.prices[0].amount }}
              </span>
              <span class="text-base font-medium text-gray-500">
                /{{ plan.prices[0].interval || "one-time" }}
              </span>
            </p>
            <button
              @click="handlePlanSelection(plan)"
              :disabled="isCurrentPlan(plan)"
              :class="[
                'mt-8 block w-full py-3 px-6 border border-accent50 rounded-md text-center font-medium',
                isCurrentPlan(plan)
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : plan.featured
                  ? 'bg-accent100 text-white hover:bg-accent50'
                  : 'bg-white text-gray-800 hover:bg-gray-50',
              ]"
            >
              {{ getButtonText(plan) }}
            </button>
          </div>
          <div class="pt-6 pb-8 px-6">
            <h3
              class="text-xs font-medium text-gray-900 tracking-wide uppercase"
            >
              What's included
            </h3>
            <ul class="mt-6 space-y-4">
              <li v-for="feature in plan.features" :key="feature" class="flex">
                <svg class="flex-shrink-0 h-5 w-5 text-accent100" />
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
import { usePremium } from "@/composables/usePremium";
import { fetchSubscriptionPlans } from "@/services/fetchSubscriptionPlans";
import type { Plan } from "@/types/plans";

const router = useRouter();
const { upgradeUser } = usePremium();
const { user } = useAuth();

const plans = ref([]);
const loadingPlans = ref(true);
const errorPlans = ref<string | null>(null);

onMounted(async () => {
  try {
    loadingPlans.value = true;
    const products = await fetchSubscriptionPlans();
    plans.value = products;
  } catch (err: any) {
    errorPlans.value = err.message || "Failed to load plans";
  } finally {
    loadingPlans.value = false;
  }
});

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
  if (!plan.prices?.[0]?.id) {
    alert("No price available for this plan.");
    return;
  }

  if (plan.id === "free") {
    router.push("/");
    return;
  }

  // Ensure user is authenticated before proceeding
  if (!user.value) {
    // Optionally, show a login modal or redirect to login
    router.push("/login");
    return;
  }

  try {
    loadingPlan.value = plan.id;
    if (!plan.priceId) {
      throw new Error("Price ID not configured for this plan");
    }

    await upgradeUser(plan.prices[0].id);
    user.value.is_premium = true;
    showSuccess.value = true;
  } catch (error) {
    console.error("Subscription error:", error);
  } finally {
    loadingPlan.value = null;
  }
};
</script>
