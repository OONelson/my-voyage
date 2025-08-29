import { ref, computed, watchEffect } from "vue";
import { supabase } from "@/config/supabase";
import type { UserProfile } from "@/types/user";
import { getUserProfile } from "@/services/supabase/auth";
import { useAuth } from "./useAuth";
import { useRouter } from "vue-router";

export const useUserProfile = () => {
  const userData = ref<UserProfile | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const router = useRouter();
  const { user: authUser } = useAuth();

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

        const { error: createError } = await supabase.from("profiles").upsert({
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
          name:
            newProfile.name ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Guest",
          email: newProfile.email || "",
          profile_image: newProfile.profile_image || "",
          is_premium: newProfile.is_premium || false,
          created_at: newProfile.created_at
            ? new Date(newProfile.created_at).toISOString()
            : new Date().toISOString(),
          updated_at: newProfile.updated_at
            ? new Date(newProfile.updated_at).toISOString()
            : new Date().toISOString(),
        };
        console.log(userData.value);

        return;
      }

      userData.value = {
        id: profileData.id,
        name: profileData.name || authUser.value?.name || "Guest",
        email: profileData.email || authUser.value?.email || "",
        profile_image:
          profileData.profile_image || authUser.value?.profile_image,
        is_premium: profileData.is_premium || false,
        created_at: profileData.created_at
          ? new Date(profileData.created_at).toISOString()
          : new Date().toISOString(),
        updated_at: profileData.updated_at
          ? new Date(profileData.updated_at).toISOString()
          : new Date().toISOString(),
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

  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      authUser.value = {
        id: session.user.id,
        name:
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "Guest",
        email: session.user.email || "",
        profile_image: session.user.user_metadata?.avatar_url || "",
        is_premium: false,
        created_at: session.user.created_at
          ? new Date(session.user.created_at).toISOString()
          : new Date().toISOString(),
        updated_at: session.user.updated_at
          ? new Date(session.user.updated_at).toISOString()
          : new Date().toISOString(),
      };
    } else {
      authUser.value = null;
    }
  });

  watchEffect(async () => {
    try {
      console.log("Auth user changed:", authUser.value?.id);

      if (authUser.value && authUser.value.id) {
        console.log("Fetching profile for user:", authUser.value);

        await fetchUserProfile(authUser.value.id);
      } else {
        console.log("No auth user, setting userData to null");
        userData.value = null;
        if (router.currentRoute.value.path !== "/login") {
          router.push("/login"); // 👈 works reliably
        }
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
