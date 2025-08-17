import { supabase } from "@/config/supabase";
import type { UserProfile, AuthUser } from "@/types/user";
import { genUtils } from "@/utils/genUtils";

const { getGravatarUrl } = genUtils();

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<{ user: AuthUser; error: Error | null }> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) return { user: null, error };

  return {
    user: data.user as AuthUser,
    error,
  };
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: AuthUser; error: Error | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data.user as AuthUser,
    error,
  };
};

export const signInWithGoogle = async (): Promise<void> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!authError && user) return user;

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error("Not authenticated");
    }

    const {
      data: { user: retryUser },
    } = await supabase.auth.getUser();

    if (!retryUser) throw new Error("User not found after session refresh");
    return retryUser;
  } catch (err) {
    console.error("Authentication error:", err);
    throw err;
  }
};

export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;

  return data;
};

export const handleAuthCallback = async (
  profileImage?: File
): Promise<AuthUser> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw error || new Error("No user found");
  }

  let imageUrl = "";
  if (profileImage && user) {
    const filePath = `profile_images/${user.id}/${profileImage.name}`;

    // Upload image
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, profileImage);

    if (!uploadError) {
      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }
  }
  // Create or update profile
  await supabase.from("users").upsert({
    id: user.id,
    email: user.email,
    name: user.user_metadata.name || "",
    profileImage: imageUrl || getGravatarUrl(user.email ?? "N"),
    is_premium: false,
    createdAt: new Date(),
  });

  return user;
};
