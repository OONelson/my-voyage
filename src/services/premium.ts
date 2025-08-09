import { supabase } from "@/config/supabase";
import type { UserProfile } from "@/types/user";

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
  const { data, error } = await supabase
    .from("profiles")
    .select("is_premium, subscription_end")
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  // Check if subscription is still valid
  if (data.subscription_end && new Date(data.subscription_end) > new Date()) {
    return true;
  }

  // If subscription expired, downgrade user
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
};
