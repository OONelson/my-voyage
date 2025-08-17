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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, avatar_url: gravatarUrl },
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
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
    name: user.user_metadata.name || "",
    profileImage: user.user_metadata?.avatar_url || gravatarUrl,
    is_premium: false,
    createdAt: new Date(),
  });

  return user;
};
