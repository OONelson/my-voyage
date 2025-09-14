import { supabase } from "@/config/supabase";
import type { UserProfile, AuthUser } from "@/types/user";

export interface UpdateProfileData {
  name?: string;
  profile_image?: string;
  email?: string;
}

export interface EmailUpdateData {
  newEmail: string;
  currentPassword: string;
}

// Get user profile
export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Update profile (name and profile image only)
export const updateProfile = async (
  userId: string,
  updateData: Omit<UpdateProfileData, "email">
): Promise<{ success: boolean; data?: UserProfile; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};

// Update email with confirmation
export const updateEmail = async (
  emailData: EmailUpdateData
): Promise<{ success: boolean; error?: string }> => {
  try {
    // First, verify the current password
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) throw new Error("No user found");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: emailData.currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    // Update the email
    const { error: updateError } = await supabase.auth.updateUser({
      email: emailData.newEmail,
    });

    if (updateError) throw updateError;

    // Update the profile table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        email: emailData.newEmail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) throw profileError;

    return { success: true };
  } catch (error) {
    console.error("Error updating email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update email",
    };
  }
};

// Upload profile image
export const uploadProfileImage = async (
  userId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
};

// Delete profile image
export const deleteProfileImage = async (
  userId: string,
  imageUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `profile-images/${fileName}`;

    const { error } = await supabase.storage.from("avatars").remove([filePath]);

    if (error) throw error;

    // Update profile to remove image
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        profile_image: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error("Error deleting profile image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
  }
};

// Resend email confirmation
export const resendEmailConfirmation = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error resending confirmation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to resend confirmation",
    };
  }
};

// Check if email is confirmed
export const checkEmailConfirmation = async (): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.email_confirmed_at !== null;
  } catch (error) {
    console.error("Error checking email confirmation:", error);
    return false;
  }
};
