import { computed } from "vue";

export interface UseAvatarAbbreviationOptions {
  maxLength?: number;
}

export function useAvatarAbbreviation(
  username: string | null | undefined,
  options: UseAvatarAbbreviationOptions = {}
) {
  const { maxLength = 2 } = options;

  const abbreviation = computed(() => {
    if (!username || username.trim().length === 0) {
      return "?";
    }

    const cleanName = username.trim();

    const namePart = cleanName.includes("@")
      ? cleanName.split("@")[0]
      : cleanName;

    const words = namePart.split(/\s+/).filter((word) => word.length > 0);

    if (words.length > 1) {
      return words
        .slice(0, maxLength)
        .map((word) => word[0].toUpperCase())
        .join("");
    } else {
      return namePart.slice(0, maxLength).toUpperCase();
    }
  });

  return {
    abbreviation,
  };
}
