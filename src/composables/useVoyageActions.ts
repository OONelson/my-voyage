import { useRouter } from "vue-router";
import { ref, type Ref } from "vue";
import type { Voyage } from "../types/Voyage";

export function useVoyageActions(
  voyages: Ref<Voyage[]>,
  currentVoyage: Ref<Voyage | null>
) {
  const router = useRouter();
  const isSmallModalOpen = ref<boolean>(false);
  const currentVoyageId = ref<string | number | null>(null);

  const editVoyage = () => {
    if (!currentVoyage.value?.id) return;
    router.push(`/voyages/${currentVoyage.value.id}/edit`);
  };

  const confirmDeleteVoyage = (voyageId: number) => {
    if (confirm("Are you sure you want to delete this voyage?")) {
      deleteVoyage(voyageId);
    }
  };

  const deleteVoyage = (voyageId: number) => {
    voyages.value = voyages.value.filter((v) => v.id !== voyageId);
    router.push("/voyages");
  };

  const openModal = (voyageId: string | number | null) => {
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
