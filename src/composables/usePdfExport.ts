import html2pdf from "html2pdf.js";

export const usePdfExport = () => {
  const exportToPdf = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    html2pdf().from(element).set({ filename }).save();
  };

  return { exportToPdf };
};
