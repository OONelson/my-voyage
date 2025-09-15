import { computed, onMounted, onUnmounted, ref, type Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { VoyageTypeInfo } from "@/types/voyage";
import { usePlanLimits } from "@/composables/usePlanLimits";
import {
  createVoyage,
  deleteVoyage,
  fetchVoyageById,
  fetchVoyages,
  updateVoyage,
} from "@/services/supabase/voyage";
import type { FormDataType } from "@/types/formData";
// import type { LocationSuggestion } from "@/composables/useMap";

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
  formData: Ref<FormDataType>;

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
  handleEdit: () => void;
  handleDelete: () => void;
  fetchVoyage: (voyageId: string) => Promise<VoyageTypeInfo | undefined>;
  toggleFavorite: (voyageId: string) => void;
  handleCreateVoyage: (
    newVoyageData: FormDataType
  ) => Promise<VoyageTypeInfo | null>;
  handleFetchVoyages: () => Promise<void>;
  handleDeleteVoyage: (voyageId: string) => Promise<void>;
  handleUpdateVoyage: (
    id: string,
    updates: Partial<FormDataType> & {
      latitude?: number | null;
      longitude?: number | null;
    }
  ) => Promise<VoyageTypeInfo | null>;
}

export const useVoyageManager = (): VoyageManager => {
  const route = useRoute();
  const router = useRouter();

  // State
  const scrolled = ref(false);
  const isProfileModal = ref(false);
  const isMenuOpen = ref(false);
  const voyages = ref<VoyageTypeInfo[]>([]);
  const voyage = ref<VoyageTypeInfo | null>(null);
  const isSmallModalOpen = ref(false);
  const currentVoyageId = ref<string | null>(null);
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const size = ref<ModalSize>("md");
  const favorites = ref<string[]>(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const formData = ref<FormDataType>({
    title: "",
    image_urls: [],
    notes: "",
    location: "",
    start_date: "",
    end_date: "",
    rating: 0,
  });

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

  // Modal fuunctions
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

  const handleFetchVoyages = async (): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;
      const data = await fetchVoyages();
      voyages.value = data;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch voyages";
    } finally {
      isLoading.value = false;
    }
  };

  const handleCreateVoyage = async (
    newVoyageData: FormDataType
  ): Promise<VoyageTypeInfo | null> => {
    try {
      isLoading.value = true;
      error.value = null;

      // Simplified validation - just check title
      if (!newVoyageData.title?.trim()) {
        throw new Error("Please enter a title for your voyage");
      }

      // Pass the data directly without complex merging
      const created = await createVoyage(newVoyageData);

      console.log("created", created);
      if (created) {
        voyages.value.unshift(created);
        // Reset form data
        formData.value = {
          title: "",
          image_urls: [],
          notes: "",
          location: "",
          start_date: "",
          end_date: "",
          rating: 0,
        };

        navigateToVoyage(created.id);

        try {
          const { useToast } = await import("@/composables/useToast");
          const { addToast } = useToast();
          addToast("Voyage created successfully", { type: "success" });
        } catch (err) {
          console.error("Error adding toast:", err);
        }

        return created;
      }

      return null;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create voyage";
      error.value = message;

      try {
        const { useToast } = await import("@/composables/useToast");
        const { addToast } = useToast();
        addToast(message, { type: "error" });
      } catch (err) {
        console.error("Error adding toast:", err);
      }

      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const editVoyage = (voyageId: string) => {
    navigateToEdit(voyageId);
  };

  const handleEdit = () => {
    if (currentVoyageId.value) {
      editVoyage(currentVoyageId.value);
      closeModal();
    }
  };

  const handleDeleteVoyage = async (voyageId: string): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;

      await deleteVoyage(voyageId);
      voyages.value = voyages.value.filter((voyage) => voyage.id !== voyageId);

      closeModal();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to delete voyage";
    } finally {
      isLoading.value = false;
    }
  };

  const confirmDeleteVoyage = (voyageId: string) => {
    currentVoyageId.value = voyageId;
    openModal(voyageId, "sm");
  };

  const handleDelete = () => {
    if (currentVoyageId.value) {
      handleDeleteVoyage(currentVoyageId.value);
    }
  };

  const handleUpdateVoyage = async (
    id: string,
    updates: Partial<FormDataType> & {
      latitude?: number | null;
      longitude?: number | null;
    }
  ): Promise<VoyageTypeInfo | null> => {
    try {
      isLoading.value = true;
      error.value = null;

      const updated = await updateVoyage(id, updates);
      if (updated) {
        // update local list cache
        const idx = voyages.value.findIndex((v) => v.id === id);
        if (idx !== -1) {
          voyages.value[idx] = {
            ...voyages.value[idx],
            ...updated,
          } as VoyageTypeInfo;
        }

        try {
          const { useToast } = await import("@/composables/useToast");
          const { addToast } = useToast();
          addToast("Voyage updated", { type: "success" });
        } catch (err) {
          console.error("Error adding toast:", err);
        }

        return updated;
      }
      return null;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update voyage";
      error.value = message;
      try {
        const { useToast } = await import("@/composables/useToast");
        const { addToast } = useToast();
        addToast(message, { type: "error" });
      } catch (e) {
        console.error("Error adding toast:", e);
      }
      return null;
    } finally {
      isLoading.value = false;
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
      const foundVoyage = await fetchVoyageById(voyageId);
      if (!foundVoyage) {
        error.value = "Voyage not found";
        return undefined;
      }

      voyage.value = foundVoyage;
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

  // Lifecycle Hooks
  onMounted(async () => {
    window.addEventListener("scroll", handleScroll);
    await handleFetchVoyages();
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
    formData,
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
    handleEdit,
    handleDelete,
    fetchVoyage,
    handleCreateVoyage,
    handleFetchVoyages,
    handleDeleteVoyage,
    handleUpdateVoyage,
    favorites,
  };
};
