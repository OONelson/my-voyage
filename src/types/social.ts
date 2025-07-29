export type SocialPlatform = "facebook" | "x" | "whatsapp" | "linkedin";

export interface Platform {
  socialMedia: SocialPlatform;
  icon: string;
}
