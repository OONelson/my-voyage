import html2pdf from "html2pdf.js";
import { usePremium } from "@/composables/usePremium";
import { useRouter } from "vue-router";
import { showToast } from "@/utils/showToast";

export const usePdfExport = () => {
  const { limits } = usePremium();
  const router = useRouter();

  const exportToPdf = async (elementId: string, filename: string) => {
    if (!limits.canExportPdf) {
      showToast(
        "PDF export is a premium feature. Please upgrade to continue.",
        "warning"
      );
      router.push("/pricing");
      return;
    }

    const element = document.getElementById(elementId);
    if (!element) {
      showToast("Content not found for export", "error");
      return;
    }

    try {
      showToast("Generating PDF...", "info");

      const opt = {
        margin: 0.5,
        filename: `${filename}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
      showToast("PDF exported successfully!", "success");
    } catch (error) {
      console.error("PDF export error:", error);
      showToast("Failed to export PDF. Please try again.", "error");
    }
  };

  const canExport = () => limits.canExportPdf;

  return { exportToPdf, canExport };
};
