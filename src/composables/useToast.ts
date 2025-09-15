import { ref } from "vue";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

const toasts = ref<ToastItem[]>([]);
let nextId = 1;

export const useToast = () => {
  const addToast = (
    message: string,
    options: { type?: ToastType; duration?: number } = {}
  ) => {
    const { type = "info", duration = 3500 } = options;
    const id = nextId++;
    const toast: ToastItem = { id, message, type, duration };
    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }

    return id;
  };

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) toasts.value.splice(index, 1);
  };

  return { toasts, addToast, removeToast };
};
