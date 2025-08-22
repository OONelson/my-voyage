import { supabase } from "@/config/supabase";
import type { UserProfile, AuthUser } from "@/types/user";
import { genUtils } from "@/utils/genUtils";

const { generateEmailHash } = genUtils();

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<{ user: AuthUser; error: Error | null }> => {
  const emailHash = await generateEmailHash(email);
  const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;

  console.log("1");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, profile_image: gravatarUrl },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  console.log("2", data);

  if (error) return { user: null, error };

  if (data.user) {
    await supabase.from("users").upsert({
      id: data.user.id,
      email,
      name,
      profile_image: gravatarUrl,
      is_premium: false,
      created_at: new Date().toISOString(),
    });
  }
  console.log("3", data);

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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async (
  userId: string | undefined
): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;

  return data;
};

export const handleAuthCallback = async (email: string): Promise<AuthUser> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw error || new Error("No user found");
  }

  const emailHash = await generateEmailHash(email);
  const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;

  await supabase.from("users").upsert({
    id: user.id,
    email: user.email,
    name: user?.user_metadata?.full_name || user?.email || "guest",
    profileImage: user.user_metadata?.avatar_url || gravatarUrl,
    is_premium: false,
    created_at: new Date(),
  });

  return user;
};
