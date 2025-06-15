import { useRouter } from "vue-router";
import { ref, type Ref } from "vue";
import type { VoyageTypeInfo } from "../types/Voyage";

interface VoyageActions {
  editVoyage: (voyageId: number) => void;
  confirmDeleteVoyage: (voyageId: number) => void;
  deleteVoyage: (voyageId: number) => void;
  openModal: (voyageId: number) => void;
  closeModal: () => void;
  isSmallModalOpen: Ref<boolean>;
  currentVoyageId: Ref<number | null>;
}

export function useVoyageActions(
  voyages?: Ref<VoyageTypeInfo[]>
): VoyageActions {
  const router = useRouter();
  const isSmallModalOpen = ref<boolean>(false);
  const currentVoyageId = ref<number | null>(null);

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

  const openModal = (voyageId: number) => {
    currentVoyageId.value = voyageId;
    isSmallModalOpen.value = true;
  };
  const closeModal = () => {
    isSmallModalOpen.value = false;
    currentVoyageId.value = null;
  };

  return {
    editVoyage,
    confirmDeleteVoyage,
    deleteVoyage,
    openModal,
    closeModal,
    isSmallModalOpen,
    currentVoyageId,
  };
}
