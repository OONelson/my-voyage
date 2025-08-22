import type { User } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  profile_image?: string | null;
  is_premium: boolean;
  created_at: Date;
  updated_at: Date;
};
export type AuthUser =
  | (User & {
      profile?: UserProfile;
    })
  | null;
