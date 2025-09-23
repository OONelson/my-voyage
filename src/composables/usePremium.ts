import { ref, computed } from "vue";
import { supabase } from "@/config/supabase";
import { checkPremiumStatus, upgradeToPremium } from "@/services/premium";

export interface PlanLimits {
  maxImagesPerEntry: number;
  maxVoyageEntries: number;
  maxPinnedLocations: number;
  isPremium: boolean;
}

export interface PremiumFeatures {
  isPremium: boolean;
  loading: boolean;
  error: Error | null;
  limits: PlanLimits;
  checkStatus: () => Promise<void>;
  upgradeUser: () => Promise<void>;
  loadUserPlan: () => Promise<void>;
}

export const usePremium = (userId?: string): PremiumFeatures => {
  const userPlan = ref<PlanLimits>({
    maxImagesPerEntry: 1,
    maxVoyageEntries: 10,
    maxPinnedLocations: 5,
    isPremium: false,
  });

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const loadUserPlan = async () => {
    loading.value = true;
    error.value = null;

    try {
      let currentUserId = userId;

      // If no userId provided, get current authenticated user
      if (!currentUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("No user authenticated");
        }
        currentUserId = user.id;
      }

      // First try the external premium service
      try {
        const isUserPremium = await checkPremiumStatus(currentUserId);

        if (isUserPremium) {
          userPlan.value = {
            maxImagesPerEntry: 10,
            maxVoyageEntries: 100,
            maxPinnedLocations: 50,
            isPremium: true,
          };
        } else {
          // Fallback to checking Supabase subscriptions table
          const { data: subscription, error: subscriptionError } =
            await supabase
              .from("user_subscriptions")
              .select("*")
              .eq("user_id", currentUserId)
              .eq("status", "active")
              .single();

          if (subscriptionError && subscriptionError.code !== "PGRST116") {
            console.warn("Subscription check error:", subscriptionError);
          }

          if (subscription) {
            userPlan.value = {
              maxImagesPerEntry: 10,
              maxVoyageEntries: 100,
              maxPinnedLocations: 50,
              isPremium: true,
            };
          } else {
            userPlan.value = {
              maxImagesPerEntry: 1,
              maxVoyageEntries: 10,
              maxPinnedLocations: 5,
              isPremium: false,
            };
          }
        }
      } catch (serviceError) {
        console.warn(
          "Premium service unavailable, using fallback:",
          serviceError
        );

        // Fallback to only Supabase check
        const { data: subscription } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", currentUserId)
          .eq("status", "active")
          .single();

        if (subscription) {
          userPlan.value = {
            maxImagesPerEntry: 10,
            maxVoyageEntries: 100,
            maxPinnedLocations: 50,
            isPremium: true,
          };
        } else {
          userPlan.value = {
            maxImagesPerEntry: 1,
            maxVoyageEntries: 10,
            maxPinnedLocations: 5,
            isPremium: false,
          };
        }
      }
    } catch (err) {
      error.value = err as Error;
      console.error("Error loading user plan:", err);

      // Set default free plan on error
      userPlan.value = {
        maxImagesPerEntry: 1,
        maxVoyageEntries: 10,
        maxPinnedLocations: 5,
        isPremium: false,
      };
    } finally {
      loading.value = false;
    }
  };

  const checkStatus = async () => {
    await loadUserPlan();
  };

  const upgradeUser = async () => {
    loading.value = true;
    error.value = null;

    try {
      let currentUserId = userId;

      // If no userId provided, get current authenticated user
      if (!currentUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("No user authenticated");
        }
        currentUserId = user.id;
      }

      await upgradeToPremium(currentUserId);

      // Refresh the user plan after upgrade
      await loadUserPlan();
    } catch (err) {
      error.value = err as Error;
      console.error("Error upgrading user:", err);
      throw err; // Re-throw to allow component-level handling
    } finally {
      loading.value = false;
    }
  };

  // Computed properties for easy access
  const limits = computed(() => userPlan.value);
  const isPremium = computed(() => userPlan.value.isPremium);

  return {
    isPremium: isPremium.value,
    loading: loading.value,
    error: error.value,
    limits: limits.value,
    checkStatus,
    upgradeUser,
    loadUserPlan,
  };
};

// Legacy alias for backward compatibility
export const usePlanLimits = () => {
  const premium = usePremium();

  return {
    limits: premium.limits,
    isPremium: premium.isPremium,
    loadUserPlan: premium.loadUserPlan,
  };
};
