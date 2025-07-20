import { ref, type Ref } from "vue";
import { genUtils } from "../utils/genUtils";

interface ImageActions {
  handleDrop: (e: DragEvent) => void;
  handleDragOver: (e: DragEvent) => void;
  handleDragLeave: (e: DragEvent) => void;
  openFileInput: () => void;
  handleImageUpload: (e: Event) => void;
  dragOver: Ref<boolean>;
  fileInput: Ref<HTMLInputElement | null>;
  isImgLoading: Ref<boolean>;
}
export const useImageUpload = (): ImageActions => {
  const isImgLoading = ref<boolean>(false);
  const dragOver = ref<boolean>(false);
  const fileInput = ref<HTMLInputElement | null>(null);

  const { formData } = genUtils();

  const openFileInput = () => {
    if (!isImgLoading.value) {
      fileInput.value?.click();
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!isImgLoading.value) {
      dragOver.value = true;
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    dragOver.value = false;
  };

  const handleDrop = (e: DragEvent) => {
    dragOver.value = false;

    if (isImgLoading.value) return;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0 && files[0].type.startsWith("image/")) {
      processImage(files[0]);
    }
  };

  const processImage = (file: Blob) => {
    isImgLoading.value = true;

    const reader = new FileReader();

    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setTimeout(() => {
          if (e.target) {
            console.log(e.target);
            formData.value.imageUrl = (e.target as FileReader).result as string;
            console.log(formData.value.imageUrl);
          }
          isImgLoading.value = false;
        }, 3000);
      }
    };
    reader.onerror = () => {
      isImgLoading.value = false;
      console.log("Error reading file");
    };

    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: Event) => {
    const input = (e.target as HTMLInputElement).files?.[0];
    if (input && !isImgLoading.value) {
      processImage(input);

      (e.target as HTMLInputElement).value = "";
    }
  };

  return {
    handleDrop,
    openFileInput,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    dragOver,
    fileInput,
    isImgLoading,
  };
};
