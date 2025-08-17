import { ref, computed, watchEffect } from "vue";
import { supabase } from "@/config/supabase";
import type { UserProfile } from "@/types/user";
import { getUserProfile } from "@/services/supabase/auth";
import { useAuth } from "./useAuth";

export const useUserProfile = () => {
  const userData = ref<UserProfile | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const { user } = useAuth();

  const maskedEmail = computed(() => {
    if (!userData.value?.email) return "";
    const [username, domain] = userData.value.email.split("@");
    return `${username?.substring(0, 2)}****${username?.slice(-1)}@${domain}`;
  });

  const fetchUserProfile = async (userId: string) => {
    try {
      loading.value = true;
      error.value = null;

      const profileData = await getUserProfile(userId);

      if (!profileData) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { error: createError } = await supabase.from("users").upsert({
          id: userId,
          email: user.email,
          created_at: new Date().toISOString(),
          name: user.email ? user.email.split("@")[0] : "Guest",
        });

        if (createError) throw createError;

        const newProfile = await getUserProfile(userId);
        if (!newProfile) throw new Error("Profile creation failed");

        userData.value = {
          id: newProfile.id,
          name: newProfile.name || "Guest",
          email: newProfile.email || "",
          profileImage: newProfile.profileImage || "",
          is_premium: newProfile.is_premium || false,
          created_at: newProfile.created_at
            ? new Date(newProfile.created_at)
            : new Date(),
        };
        return;
      }

      userData.value = {
        id: profileData.id,
        name: profileData.name || user.value?.name || "Guest",
        email: profileData.email || "",
        profileImage: profileData.profileImage || "",
        is_premium: profileData.is_premium || false,
        created_at: profileData.created_at
          ? new Date(profileData.created_at)
          : new Date(),
      };

      console.log(userData.value);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to Load Profile";
      console.error("profile fetch error", err);
    } finally {
      loading.value = false;
    }
  };

  watchEffect(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await fetchUserProfile(user.id);
      }
    } catch (err) {
      console.error("Auth watch error:", err);
    }
  });

  return {
    userData,
    error,
    loading,
    maskedEmail,
  };
};
