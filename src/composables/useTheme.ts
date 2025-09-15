import { ref, computed, watch, onMounted, onUnmounted } from "vue";

export type Theme = "light" | "dark" | "system";

export const useTheme = () => {
  const theme = ref<Theme>("system");
  const systemTheme = ref<"light" | "dark">("light");

  // Computed property for the actual theme being applied
  const actualTheme = computed(() => {
    if (theme.value === "system") {
      return systemTheme.value;
    }
    return theme.value;
  });

  // Check if the current theme is dark
  const isDark = computed(() => actualTheme.value === "dark");

  // Check if the current theme is light
  const isLight = computed(() => actualTheme.value === "light");

  // Check if the current theme is system
  const isSystem = computed(() => theme.value === "system");

  // Media query listener for system theme changes
  let mediaQuery: MediaQueryList | null = null;

  // Initialize theme from localStorage or default to system
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      theme.value = savedTheme;
    } else {
      theme.value = "system";
    }
  };

  // Set up system theme detection
  const setupSystemThemeDetection = () => {
    if (typeof window !== "undefined" && window.matchMedia) {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      systemTheme.value = mediaQuery.matches ? "dark" : "light";

      const handleChange = (e: MediaQueryListEvent) => {
        systemTheme.value = e.matches ? "dark" : "light";
      };

      mediaQuery.addEventListener("change", handleChange);

      // Return cleanup function
      return () => {
        if (mediaQuery) {
          mediaQuery.removeEventListener("change", handleChange);
        }
      };
    }
    return () => {};
  };

  // Apply theme to document
  const applyTheme = () => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const currentTheme = actualTheme.value;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Add current theme class
    root.classList.add(currentTheme);

    // Set data attribute for CSS targeting
    root.setAttribute("data-theme", currentTheme);

    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(currentTheme);
  };

  // Update meta theme-color for mobile browsers
  const updateMetaThemeColor = (currentTheme: "light" | "dark") => {
    if (typeof document === "undefined") return;

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }

    // Set theme color based on current theme
    const colors = {
      light: "#fcfcfc", // background100 from tailwind config
      dark: "#121212", // textblack200 from tailwind config
    };

    metaThemeColor.setAttribute("content", colors[currentTheme]);
  };

  // Set theme
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem("theme", newTheme);
    applyTheme();
  };

  // Toggle between light and dark (useful for quick toggle)
  const toggleTheme = () => {
    if (theme.value === "system") {
      setTheme(systemTheme.value === "light" ? "dark" : "light");
    } else {
      setTheme(theme.value === "light" ? "dark" : "light");
    }
  };

  // Get theme display name
  const getThemeDisplayName = (themeValue: Theme) => {
    const names = {
      light: "Light",
      dark: "Dark",
      system: "System",
    };
    return names[themeValue];
  };

  // Get all available themes
  const availableThemes = computed(() => [
    { value: "light" as Theme, label: "Light" },
    { value: "dark" as Theme, label: "Dark" },
    { value: "system" as Theme, label: "System" },
  ]);

  // Watch for theme changes and apply them
  watch(
    [theme, systemTheme],
    () => {
      applyTheme();
    },
    { immediate: true }
  );

  // Cleanup function
  let cleanup: (() => void) | undefined;

  // Initialize on mount
  onMounted(() => {
    initializeTheme();
    cleanup = setupSystemThemeDetection();
    applyTheme();
  });

  // Cleanup on unmount
  onUnmounted(() => {
    if (cleanup) {
      cleanup();
    }
  });

  return {
    // State
    theme: computed(() => theme.value),
    actualTheme,
    systemTheme: computed(() => systemTheme.value),
    isDark,
    isLight,
    isSystem,

    // Actions
    setTheme,
    toggleTheme,
    getThemeDisplayName,
    availableThemes,

    // Utilities
    applyTheme,
  };
};
