import { supabase } from "@/config/supabase";
import type { UserProfile, AuthUser } from "@/types/user";

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<{ user: AuthUser | null; error: Error | null }> => {
  try {
    console.log("3");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    console.log("4");

    if (error) return { user: null, error };

    console.log("5");

    return {
      user: data.user,
      error,
    };
  } catch (err) {
    console.log("sign up error", err);
    throw err;
  }
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

export const deleteUserAccount = async (
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // 1. First delete user data from your tables
    const { error: dataError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (dataError) {
      throw new Error(`Failed to delete user data: ${dataError.message}`);
    }

    // 2. Delete the auth user (this removes the account completely)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      throw new Error(`Failed to delete auth user: ${authError.message}`);
    }
    signOut();

    return { success: true };
  } catch (error) {
    console.error("Account deletion error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async (
  userId: string | undefined
): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;

  return data;
};

export const handleAuthCallback = async (): Promise<AuthUser> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw error || new Error("No user found");
  }

  // const emailHash = await generateEmailHash(email);
  // const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;

  const avatarUrl = user.user_metadata?.avatar_url as string | null;

  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    name: user?.user_metadata?.full_name || user?.email || "guest",
    profileImage: avatarUrl,
    is_premium: false,
    created_at: new Date(),
  });

  return user;
};
