const showToast = async (
  message: string,
  type: "success" | "error" | "info" | "warning"
) => {
  try {
    const { useToast } = await import("@/composables/useToast");
    const { addToast } = useToast();
    addToast(message, { type });
  } catch (err) {
    console.error("Error adding toast:", err);
  }
};

export { showToast };
