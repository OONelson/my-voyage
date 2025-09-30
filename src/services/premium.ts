import { supabase } from "@/config/supabase";
import type { UserProfile } from "@/types/user";
import { stripeService } from "@/services/stripe";


export const upgradeToPremium = async (
  userId: string
): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      is_premium: true,
      subscription_end: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

export const checkPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    const subscriptionStatus = await stripeService.getSubscriptionStatus();
    const hasActiveSubscription = ["active", "trailing"].includes(
      subscriptionStatus
    );

    if (hasActiveSubscription) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_premium, subscription_end")
        .eq("user_id", userId)
        .single();

      if (!profile?.is_premium) {
        await supabase
          .from("profiles")
          .update({ is_premium: true })
          .eq("user_id", userId);
      }
      return true;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("is_premium, subscription_end")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    if (data.subscription_end && new Date(data.subscription_end) > new Date()) {
      return true;
    }

    if (
      data.is_premium &&
      (!data.subscription_end || new Date(data.subscription_end) <= new Date())
    ) {
      await supabase
        .from("profiles")
        .update({ is_premium: false })
        .eq("user_id", userId);
      return false;
    }

    return data.is_premium;
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
};

//
export const initiatePremiumCheckout = async (
  priceId: string
): Promise<void> => {
  try {
    const sessionId = await stripeService.createCheckoutSession(priceId);
    await stripeService.redirectToCheckout(sessionId);
  } catch (error) {
    console.error("Checkout initiation failed:", error);
    throw error;
  }
};

// New function to manage subscription
export const manageSubscription = async (): Promise<void> => {
  try {
    const portalUrl = await stripeService.createCustomerPortalSession();
    window.location.href = portalUrl;
  } catch (error) {
    console.error("Failed to create customer portal:", error);
    throw error;
  }
};