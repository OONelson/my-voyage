import { useRouter } from "vue-router";
import { ref, type Ref } from "vue";
import type { VoyageTypeInfo } from "../types/Voyage";
import { Voyages } from "../constants/constant";

interface VoyageActions {
  editVoyage: (voyageId: number) => void;
  editVoyageInList: (voyageId: number) => void;
  confirmDeleteVoyage: (voyageId: number) => void;
  deleteVoyage: (voyageId: number) => void;
  openModal: (voyageId: number, modalSize: "sm" | "md" | "lg" | "xl") => void;
  closeModal: () => void;
  isSmallModalOpen: Ref<boolean>;
  currentVoyageId: Ref<number | null>;
  isLoading: Ref<boolean>;
  fetchVoyage: (voyageId: number) => void;
  size: Ref<"sm" | "md" | "lg" | "xl">;
}

export const useVoyageActions = (
  voyages?: Ref<VoyageTypeInfo[]>
): VoyageActions => {
  const router = useRouter();
  const isSmallModalOpen = ref<boolean>(false);
  const currentVoyageId = ref<number | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const size = ref<"sm" | "md" | "lg" | "xl">("md");

  const fetchVoyage = async (voyageId: number) => {
    isLoading.value = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 8000));

      // Simulate random error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error("Failed to load voyage data");
      }

      const foundVoyage = Voyages.find((v) => v.id === voyageId);
      if (!foundVoyage) {
        throw new Error("Voyage not found");
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load voyage";
      console.log("Error fetching voyage:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const editVoyageInList = (voyageId: number) => {
    router.push(`/voyages/${voyageId}/edit`);
  };

  const editVoyage = (voyageId: number) => {
    router.push(`/voyages/${voyageId}/edit`);
  };

  const deleteVoyage = (voyageId: number) => {
    if (voyages) {
      voyages.value = voyages.value.filter((v) => v.id !== voyageId);
    }
    router.push("/voyages");
  };

  const confirmDeleteVoyage = (voyageId: number) => {
    if (confirm("Are you sure you want to delete this voyage?")) {
      deleteVoyage(voyageId);
    }
  };

  const openModal = (
    voyageId: number,
    modalSize: "sm" | "md" | "lg" | "xl"
  ) => {
    size.value = modalSize;
    currentVoyageId.value = voyageId;
    isSmallModalOpen.value = true;
  };
  const closeModal = () => {
    isSmallModalOpen.value = false;
    currentVoyageId.value = null;
  };

  return {
    editVoyage,
    editVoyageInList,
    confirmDeleteVoyage,
    deleteVoyage,
    openModal,
    closeModal,
    fetchVoyage,
    isSmallModalOpen,
    currentVoyageId,
    isLoading,
    size,
  };
};
