import { supabase } from "@/config/supabase";

export async function fetchSubscriptionPlans() {
  const { data, error } = await supabase.functions.invoke(
    "get-subscription-plans"
  );
  if (error) throw new Error(error.message);
  return data.products;
}
