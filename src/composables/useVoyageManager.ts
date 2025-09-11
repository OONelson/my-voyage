import { computed, onMounted, onUnmounted, ref, type Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { VoyageTypeInfo } from "@/types/voyage";
import { Voyages } from "@/constants/constant";
import { usePlanLimits } from "@/composables/usePlanLimits";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface VoyageManager {
  // State
  voyages: Ref<VoyageTypeInfo[]>;
  voyage: Ref<VoyageTypeInfo | null>;
  voyageId: Ref<string | null>;
  favorites: Ref<string[]>;
  scrolled: Ref<boolean>;
  isMenuOpen: Ref<boolean>;
  isProfileModal: Ref<boolean>;
  isSmallModalOpen: Ref<boolean>;
  currentVoyageId: Ref<string | null>;
  isLoading: Ref<boolean>;
  size: Ref<ModalSize>;
  error: Ref<string | null>;
  favoriteVoyages: Ref<VoyageTypeInfo[]>;

  // Navigation
  toggleMenu: () => void;
  navigateToCreate: () => void;
  navigateToFavorites: () => void;
  navigateToVoyage: (id: string) => void;
  navigateToVoyages: () => void;

  // Modals
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openModal: (voyageId: string, modalSize?: ModalSize) => void;
  closeModal: () => void;
  openOptionsModal: (voyageId: string) => void;

  // Actions
  editVoyage: (voyageId: string) => void;
  confirmDeleteVoyage: (voyageId: string) => void;
  deleteVoyage: (voyageId: string) => void;
  handleEdit: () => void;
  handleDelete: () => void;
  fetchVoyage: (voyageId: string) => Promise<VoyageTypeInfo | undefined>;
  toggleFavorite: (voyageId: string) => void;
}

export const useVoyageManager = (): VoyageManager => {
  const route = useRoute();
  const router = useRouter();

  // State
  const scrolled = ref(false);
  const isProfileModal = ref(false);
  const isMenuOpen = ref(false);
  const voyages = ref<VoyageTypeInfo[]>(Voyages);
  const voyage = ref<VoyageTypeInfo | null>(null);
  const isSmallModalOpen = ref(false);
  const currentVoyageId = ref<string | null>(null);
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const size = ref<ModalSize>("md");
  const favorites = ref<string[]>(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );

  const { limits } = usePlanLimits();

  const voyageId = computed(() => {
    try {
      const idParam = route.params?.id;
      if (!idParam) return null;

      return idParam.toString();
    } catch (error) {
      console.error("Error getting voyage ID:", error);
      return null;
    }
  });

  // Event Handlers
  const handleScroll = () => {
    scrolled.value = window.scrollY > 10;
  };

  // Navigations
  const navigateToCreate = () => {
    if (voyages.value.length >= limits.value.maxVoyageEntries) {
      router.push("/pricing");
      isMenuOpen.value = false;
      return;
    }
    router.push("/voyages/create");
    isMenuOpen.value = false;
  };
  const navigateToFavorites = () => {
    router.push("/voyages/favourites");
    isMenuOpen.value = false;
  };

  const navigateToVoyage = (voyageId: string) => {
    router.push(`/voyages/${voyageId}`);
    isMenuOpen.value = false;
  };

  const navigateToVoyages = () => {
    router.push("/voyages");
    isMenuOpen.value = false;
  };
  const navigateToEdit = (voyageId: string) => {
    router.push(`/voyages/${voyageId}/edit`);
  };

  // Modal Methods
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const openProfileModal = () => {
    isProfileModal.value = true;
  };

  const closeProfileModal = () => {
    isProfileModal.value = false;
  };

  const openModal = (voyageId: string, modalSize?: ModalSize) => {
    size.value = modalSize ?? "md";
    currentVoyageId.value = voyageId;
    isSmallModalOpen.value = true;
  };

  const closeModal = () => {
    isSmallModalOpen.value = false;
    currentVoyageId.value = null;
  };

  const openOptionsModal = (voyageId: string) => {
    openModal(voyageId, "sm");
  };

  // Voyage Actions

  const editVoyage = (voyageId: string) => {
    navigateToEdit(voyageId);
  };

  const deleteVoyage = (voyageId: string) => {
    voyages.value = voyages.value.filter((v) => v.id !== voyageId);
    router.push("/voyages");
  };

  const confirmDeleteVoyage = (voyageId: string) => {
    if (confirm("Are you sure you want to delete this voyage?")) {
      deleteVoyage(voyageId);
    }
  };

  const handleEdit = () => {
    if (currentVoyageId.value) {
      editVoyage(currentVoyageId.value);
      closeModal();
    }
  };

  const handleDelete = () => {
    if (currentVoyageId.value) {
      confirmDeleteVoyage(currentVoyageId.value);
      closeModal();
    }
  };

  // Filter favorite voyages
  const favoriteVoyages = computed(() => {
    return voyages.value.filter((voyage) =>
      favorites.value.includes(voyage.id)
    );
  });

  // Toggle favorite status
  const toggleFavorite = (voyageId: string) => {
    const index = favorites.value.indexOf(voyageId);
    if (index === -1) {
      favorites.value.push(voyageId);
    } else {
      favorites.value.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites.value));
  };

  // Data Loading
  const fetchVoyage = async (
    voyageId: string
  ): Promise<VoyageTypeInfo | undefined> => {
    isLoading.value = true;
    error.value = null;
    try {
      // Simulate network delay
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      const foundVoyage = Voyages.find((v) => v.id === voyageId);
      if (!foundVoyage) {
        error.value = "voyage not found";
        console.log("Voyage not found");
        return undefined;
      }

      voyage.value = foundVoyage;
      // console.log(foundVoyage);
      return foundVoyage;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load voyage";
      console.error("Error fetching voyage:", err);
      return undefined;
    } finally {
      isLoading.value = false;
    }
  };

  const loadVoyages: () => Promise<VoyageTypeInfo[]> = async () => {
    error.value = null;
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return Voyages; // Return the mock data
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load voyage";
      console.error("Failed to load voyages:", err);
      return [];
    }
  };

  const loadVoyageData = async (): Promise<VoyageTypeInfo | null> => {
    error.value = null;
    try {
      // Just use the mock data directly
      return Voyages.find((v) => v.id === voyageId.value) || null;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load voyage";
      console.error("Failed to load voyage data:", error);
      return null;
    }
  };

  const executeWithDelay = async <T>(
    action: Promise<T> | (() => Promise<T>)
  ): Promise<T> => {
    isLoading.value = true;
    error.value = null;

    try {
      const minLoadingTime = new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );
      const actionPromise = typeof action === "function" ? action() : action;

      const result = await Promise.all([minLoadingTime, actionPromise]).then(
        ([, res]) => res
      );
      return result;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unknown error occurred";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Lifecycle Hooks
  onMounted(async () => {
    window.addEventListener("scroll", handleScroll);
    try {
      voyages.value = await executeWithDelay(loadVoyages());

      // Only try to load single voyage if we have an ID
      if (voyageId.value) {
        voyage.value = await loadVoyageData();
      }
    } catch (err) {
      console.error("Initialization error:", err);
      error.value =
        err instanceof Error ? err.message : "Initialization failed";
    }
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  return {
    voyages,
    voyage,
    voyageId,
    scrolled,
    isMenuOpen,
    isProfileModal,
    isSmallModalOpen,
    currentVoyageId,
    favoriteVoyages,
    isLoading,
    size,
    error,
    toggleMenu,
    toggleFavorite,
    navigateToCreate,
    navigateToFavorites,
    navigateToVoyage,
    navigateToVoyages,
    openProfileModal,
    closeProfileModal,
    openModal,
    closeModal,
    openOptionsModal,
    editVoyage,
    confirmDeleteVoyage,
    deleteVoyage,
    handleEdit,
    handleDelete,
    fetchVoyage,
    favorites,
  };
};
