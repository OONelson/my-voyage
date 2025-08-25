import type { User } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  profile_image?: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
};
export type AuthUser =
  | (User & {
      profile?: UserProfile;
    })
  | null;
