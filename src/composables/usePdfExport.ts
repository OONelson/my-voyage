import html2pdf from "html2pdf.js";
import { usePlanLimits } from "@/composables/usePlanLimits";
import { useRouter } from "vue-router";

export const usePdfExport = () => {
  const { limits } = usePlanLimits();
  const router = useRouter();

  const exportToPdf = (elementId: string, filename: string) => {
    if (!limits.value.canExportPdf) {
      router.push("/pricing");
      return;
    }

    const element = document.getElementById(elementId);
    if (!element) return;

    html2pdf().from(element).set({ filename }).save();
  };

  return { exportToPdf };
};
