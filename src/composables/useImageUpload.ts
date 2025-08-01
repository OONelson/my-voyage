import { computed, nextTick, ref, type ComputedRef, type Ref } from "vue";
import { type FormDataType } from "../types/formData";

interface ImageActions {
  handleDrop: (e: DragEvent) => void;
  handleDragOver: (e: DragEvent) => void;
  handleDragLeave: (e: DragEvent) => void;
  openFileInput: () => void;
  handleImageUpload: (e: Event) => void;
  dragOver: Ref<boolean>;
  fileInput: Ref<HTMLInputElement | null>;
  cropBox: Ref<HTMLElement | null>;
  isImgLoading: Ref<boolean>;
  rotate: (degrees: number) => void;
  cropImage: () => void;
  croppedImage: Ref<string>;
  handles: string[];
  imageStyle: import("vue").ComputedRef<{ transform: string }>;
  cropBoxStyle: import("vue").ComputedRef<{
    left: string;
    top: string;
    width: string;
    height: string;
  }>;
  initCropper: () => void;
  startDrag: (e: MouseEvent) => void;
  startResize: (e: MouseEvent, handle: string) => void;
  deleteSelectedImage: () => void;
  hasImage: ComputedRef<boolean>;
  showActionButtons: ComputedRef<boolean | string>;
  showOriginalImage: ComputedRef<boolean | string>;
  showCropBox: ComputedRef<boolean | string>;
  showCroppedImage: ComputedRef<boolean>;
  showEmptyState: ComputedRef<boolean>;
  modules: {
    toolbar: (string[] | { list: string }[])[];
  };
}
export const useImageUpload = (formData: Ref<FormDataType>): ImageActions => {
  const isImgLoading = ref<boolean>(false);
  const dragOver = ref<boolean>(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  const wrapper = ref<HTMLElement | null>(null);
  const image = ref<HTMLImageElement | null>(null);
  const cropBox = ref<HTMLElement | null>(null);
  const croppedImage = ref<string>("");

  // Crop state
  const cropPosition = ref({ x: 0, y: 0 });
  const cropSize = ref({ width: 200, height: 200 });
  const isDragging = ref(false);
  const isResizing = ref(false);
  const resizeHandle = ref("");
  const rotation = ref(0);
  const handles = ["n", "e", "s", "w", "ne", "nw", "se", "sw"];

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
    if (!file.type.startsWith("image/")) {
      console.error("Selected file is not an image");
      return;
    }
    isImgLoading.value = true;
    croppedImage.value = "";
    formData.value.imageUrl = "";

    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        formData.value = {
          ...formData.value,
          imageUrl: e.target.result as string,
        };
        isImgLoading.value = false;

        nextTick(() => {
          if (image.value) {
            initCropper();
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

  const deleteSelectedImage = () => {
    formData.value.imageUrl = "";
    croppedImage.value = "";
  };

  const imageStyle = computed(() => ({
    transform: `rotate(${rotation.value}deg)`,
  }));

  const cropBoxStyle = computed(() => ({
    left: `${cropPosition.value.x}px`,
    top: `${cropPosition.value.y}px`,
    width: `${cropSize.value.width}px`,
    height: `${cropSize.value.height}px`,
  }));

  // Initialize cropper when image loads
  const initCropper = () => {
    if (!wrapper.value || !image.value) return;

    // Center crop box
    cropPosition.value = {
      x: (wrapper.value.offsetWidth - cropSize.value.width) / 2,
      y: (wrapper.value.offsetHeight - cropSize.value.height) / 2,
    };
  };

  const startDrag = (e: MouseEvent) => {
    if (isResizing.value) return;
    isDragging.value = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = cropPosition.value.x;
    const startTop = cropPosition.value.y;

    const doDrag = (moveEvent: MouseEvent) => {
      if (!isDragging.value) return;
      cropPosition.value = {
        x: startLeft + (moveEvent.clientX - startX),
        y: startTop + (moveEvent.clientY - startY),
      };
    };

    const stopDrag = () => {
      isDragging.value = false;
      window.removeEventListener("mousemove", doDrag);
      window.removeEventListener("mouseup", stopDrag);
    };

    window.addEventListener("mousemove", doDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  // Resize crop box
  const startResize = (e: MouseEvent, handle: string) => {
    isResizing.value = true;
    resizeHandle.value = handle;
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = cropSize.value.width;
    const startHeight = cropSize.value.height;
    const startLeft = cropPosition.value.x;
    const startTop = cropPosition.value.y;

    const doResize = (moveEvent: MouseEvent) => {
      if (!isResizing.value) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newSize = { ...cropSize.value };
      const newPos = { ...cropPosition.value };

      // Handle different resize handles
      if (handle.includes("e")) {
        newSize.width = startWidth + deltaX;
      }
      if (handle.includes("w")) {
        newSize.width = startWidth - deltaX;
        newPos.x = startLeft + deltaX;
      }
      if (handle.includes("s")) {
        newSize.height = startHeight + deltaY;
      }
      if (handle.includes("n")) {
        newSize.height = startHeight - deltaY;
        newPos.y = startTop + deltaY;
      }

      // Apply minimum size
      if (newSize.width > 20 && newSize.height > 20) {
        cropSize.value = newSize;
        cropPosition.value = newPos;
      }
    };

    const stopResize = () => {
      isResizing.value = false;
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
    };

    window.addEventListener("mousemove", doResize);
    window.addEventListener("mouseup", stopResize);
  };

  // Perform the crop
  const cropImage = () => {
    if (!image.value || !wrapper.value) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to crop size
    canvas.width = cropSize.value.width;
    canvas.height = cropSize.value.height;

    // Calculate source coordinates
    const img = image.value;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    // Draw cropped portion
    ctx.drawImage(
      img,
      cropPosition.value.x * scaleX,
      cropPosition.value.y * scaleY,
      cropSize.value.width * scaleX,
      cropSize.value.height * scaleY,
      0,
      0,
      cropSize.value.width,
      cropSize.value.height
    );

    // Save result
    croppedImage.value = canvas.toDataURL("image/jpeg");
    formData.value.imageUrl = croppedImage.value;
    console.log(croppedImage);
  };

  // Rotate image
  const rotate = (degrees: number = 90) => {
    rotation.value = (rotation.value + degrees) % 360;
  };

  const hasImage = computed(
    () => !!formData.value.imageUrl || !!croppedImage.value
  );
  const showActionButtons = computed(
    () => formData.value.imageUrl && !isImgLoading.value
  );
  const showOriginalImage = computed(
    () => formData.value.imageUrl && !croppedImage.value && !isImgLoading.value
  );
  const showCropBox = computed(
    () => formData.value.imageUrl && !croppedImage.value && !isImgLoading.value
  );
  const showCroppedImage = computed(
    () => !!croppedImage.value && !isImgLoading.value
  );
  const showEmptyState = computed(
    () =>
      !formData.value.imageUrl &&
      !croppedImage.value &&
      !isImgLoading.value &&
      !dragOver.value
  );

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  return {
    rotate,
    initCropper,
    startDrag,
    startResize,
    cropImage,
    handleDrop,
    openFileInput,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    deleteSelectedImage,
    handles,
    imageStyle,
    cropBoxStyle,
    cropBox,
    croppedImage,
    dragOver,
    fileInput,
    isImgLoading,
    hasImage,
    showActionButtons,
    showOriginalImage,
    showCropBox,
    showCroppedImage,
    showEmptyState,
    modules,
  };
};
