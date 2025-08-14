import { ref, computed, watchEffect } from "vue";
import { supabase } from "@/config/supabase";
import { getUserProfile } from "@/services/supabase/auth";
import type { UserProfile } from "@/types/user";

export const useUserProfile = () => {
  const userData = ref<UserProfile | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const maskedEmail = computed(() => {
    if (!userData.value || !userData.value.email) return "";
    const [username, domain] = userData.value.email.split("@");
    return `${username?.substring(0, 2)}****${username?.slice(-1)}@${domain}`;
  });

  const fetchUserProfile = async (userId: string) => {
    try {
      loading.value = true;
      error.value = null;

      const profileData = await getUserProfile(userId);

      if (!profileData) {
        throw new Error("Profile not found");
      }

      userData.value = {
        id: profileData.id,
        name: profileData.name || "Guest",
        email: profileData.email || "",
        profileImage: profileData.profileImage || "",
        is_premium: profileData.is_premium || false,
        createdAt: profileData.createdAt
          ? new Date(profileData.createdAt)
          : new Date(),
      };
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to Load Profile";
      console.error("profile fetch error", err);
    } finally {
      loading.value = false;
    }
  };

  watchEffect(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        userData.value = profile;
      }
    }
  });

  return {
    userData,
    maskedEmail,
    fetchUserProfile,
  };
};
