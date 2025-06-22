import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { VoyageTypeInfo } from "../types/Voyage";
import { Voyages } from "../constants/constant";
import { useDelayedLoading } from "./useDelayedLoading";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface VoyageManager {
  // State
  voyages: Ref<VoyageTypeInfo[]>;
  voyage: Ref<VoyageTypeInfo | null>;
  voyageId: number;
  scrolled: Ref<boolean>;
  isMenuOpen: Ref<boolean>;
  isProfileModal: Ref<boolean>;
  isSmallModalOpen: Ref<boolean>;
  currentVoyageId: Ref<number | null>;
  isPageLoading: Ref<boolean>;
  //   isLoading: Ref<boolean>;
  size: Ref<ModalSize>;
  error: Ref<string | null>;

  // Navigation
  toggleMenu: () => void;
  navigateToCreate: () => void;
  navigateToFavorites: () => void;
  navigateToVoyage: (id: number) => void;

  // Modals
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openModal: (voyageId: number, modalSize: ModalSize) => void;
  closeModal: () => void;
  openOptionsModal: (voyageId: number) => void;

  // Actions
  editVoyage: (voyageId: number) => void;
  editVoyageInList: (voyageId: number) => void;
  confirmDeleteVoyage: (voyageId: number) => void;
  deleteVoyage: (voyageId: number) => void;
  handleEdit: () => void;
  handleDelete: () => void;
  fetchVoyage: (voyageId: number) => Promise<VoyageTypeInfo | undefined>;
}

export const useVoyageManager = (): VoyageManager => {
  const route = useRoute();
  const router = useRouter();
  const { executeWithDelay, isPageLoading } = useDelayedLoading();

  // State
  const scrolled = ref(false);
  const isProfileModal = ref(false);
  const isMenuOpen = ref(false);
  const voyages = ref<VoyageTypeInfo[]>([]);
  const voyage = ref<VoyageTypeInfo | null>(null);
  const isSmallModalOpen = ref(false);
  const currentVoyageId = ref<number | null>(null);
  //   const isLoading = ref(false);
  const error = ref<string | null>(null);
  const size = ref<ModalSize>("md");
  const voyageId = parseInt(route.params.id as string);

  // Event Handlers
  const handleScroll = () => {
    scrolled.value = window.scrollY > 10;
  };

  //

  const navigateToCreate = () => {
    router.push("/voyages/create");
  };
  const navigateToFavorites = () => {
    router.push("/voyages/favourites");
  };

  const navigateToVoyage = (id: number) => {
    router.push(`/voyages/${id}`);
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

  const openModal = (voyageId: number, modalSize: ModalSize) => {
    size.value = modalSize;
    currentVoyageId.value = voyageId;
    isSmallModalOpen.value = true;
  };

  const closeModal = () => {
    isSmallModalOpen.value = false;
    currentVoyageId.value = null;
  };

  const openOptionsModal = (voyageId: number) => {
    openModal(voyageId, "sm");
  };

  // Voyage Actions
  const navigateToEdit = (voyageId: number) => {
    router.push(`/voyages/${voyageId}/edit`);
  };

  const editVoyageInList = (voyageId: number) => {
    navigateToEdit(voyageId);
  };

  const editVoyage = (voyageId: number) => {
    navigateToEdit(voyageId);
  };

  const deleteVoyage = (voyageId: number) => {
    voyages.value = voyages.value.filter((v) => v.id !== voyageId);
    router.push("/voyages");
  };

  const confirmDeleteVoyage = (voyageId: number) => {
    if (confirm("Are you sure you want to delete this voyage?")) {
      deleteVoyage(voyageId);
    }
  };

  const handleEdit = () => {
    if (currentVoyageId.value) {
      editVoyageInList(currentVoyageId.value);
      closeModal();
    }
  };

  const handleDelete = () => {
    if (currentVoyageId.value) {
      confirmDeleteVoyage(currentVoyageId.value);
      closeModal();
    }
  };

  // Data Loading
  const fetchVoyage = async (
    voyageId: number
  ): Promise<VoyageTypeInfo | undefined> => {
    isPageLoading.value = true;
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundVoyage = Voyages.find((v) => v.id === voyageId);
      if (!foundVoyage) throw new Error("Voyage not found");
      return foundVoyage;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load voyage";
      console.log("Error fetching voyage:", err);
      return undefined;
    } finally {
      isPageLoading.value = false;
    }
  };

  const loadVoyages = async (): Promise<VoyageTypeInfo[]> => {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(voyages.value);
      return Voyages; // Return the mock data
    } catch (error) {
      console.log("Failed to load voyages:", error);
      return [];
    }
  };

  const loadVoyageData = async (): Promise<VoyageTypeInfo | null> => {
    try {
      // Just use the mock data directly
      return Voyages.find((v) => v.id === voyageId) || null;
    } catch (error) {
      console.error("Failed to load voyage data:", error);
      return null;
    }
  };

  // Lifecycle Hooks
  onMounted(async () => {
    window.addEventListener("scroll", handleScroll);
    try {
      // Correct way to use executeWithDelay
      voyages.value = await executeWithDelay(loadVoyages());
      console.log(voyages.value);

      // Only try to load single voyage if we have an ID
      if (voyageId) {
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
    isPageLoading,
    size,
    error,
    toggleMenu,
    navigateToCreate,
    navigateToFavorites,
    navigateToVoyage,
    openProfileModal,
    closeProfileModal,
    openModal,
    closeModal,
    openOptionsModal,
    editVoyage,
    editVoyageInList,
    confirmDeleteVoyage,
    deleteVoyage,
    handleEdit,
    handleDelete,
    fetchVoyage,
  };
};
