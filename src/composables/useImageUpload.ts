import { nextTick, ref, type Ref } from "vue";
import { type Cropper } from "vue-advanced-cropper";
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
  rotate: (degrees: number) => void;
  cropImage: () => void;
  croppedImage: Ref<string>;
}
export const useImageUpload = (): ImageActions => {
  const isImgLoading = ref<boolean>(false);
  const dragOver = ref<boolean>(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  const cropper = ref<Cropper>();
  const croppedImage = ref<string>("");

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

  const handleImageUpload = (e: Event) => {
    const input = (e.target as HTMLInputElement).files?.[0];
    if (input && !isImgLoading.value) {
      processImage(input);

      (e.target as HTMLInputElement).value = "";
    }
  };

  const processImage = (file: File) => {
    isImgLoading.value = true;
    croppedImage.value = "";

    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        formData.value.imageUrl = e.target.result as string;
        isImgLoading.value = false;

        nextTick(() => {
          if (cropper.value) {
            cropper.value.refresh();
          }
        });
      }
    };
    reader.onerror = () => {
      isImgLoading.value = false;
      console.error("Error reading file");
    };

    reader.readAsDataURL(file);
  };

  // Edit img

  // Perform crop
  const cropImage = () => {
    if (cropper.value) {
      const { canvas } = cropper.value.getResult();
      croppedImage.value = canvas.toDataURL("image/jpeg", 0.9);
    }
  };

  // Rotate image
  const rotate = (degrees: number) => {
    if (cropper.value) {
      cropper.value.rotate(degrees);
    }
  };

  return {
    rotate,
    cropImage,
    handleDrop,
    openFileInput,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    croppedImage,
    dragOver,
    fileInput,
    isImgLoading,
  };
};
