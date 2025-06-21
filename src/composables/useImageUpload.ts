import { ref, type Ref } from "vue";

interface ImageActions {
  openFileInput: () => void;
  handleDrop: (e: DragEvent) => void;
  handleImageUpload: (e: Event) => void;
  isLoading: Ref<boolean>;
  dragOver: Ref<boolean>;
  imageUrl: Ref<string | undefined>;
}

export const useImageUpload = (): ImageActions => {
  const isLoading = ref<boolean>(false);
  const dragOver = ref<boolean>(false);
  const imageUrl = ref<string | undefined>(undefined);
  const fileInput = ref<HTMLInputElement | null>(null);

  const openFileInput = () => {
    fileInput.value?.click();
  };

  const handleDrop = (e: DragEvent) => {
    dragOver.value = false;
    const files = e.dataTransfer?.files;
    if (files && files.length > 0 && files[0].type.startsWith("image/")) {
      processImage(files[0]);
    }
  };

  const processImage = (file: Blob) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        imageUrl.value = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imageUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    openFileInput,
    handleDrop,
    handleImageUpload,
    isLoading,
    imageUrl,
    dragOver,
  };
};
