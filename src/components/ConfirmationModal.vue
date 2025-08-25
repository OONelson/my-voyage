<template>
  <UModal
    v-model="isOpen"
    :ui="{
      width: 'sm:max-w-md',
      overlay: {
        background: 'bg-gray-200/75 dark:bg-gray-800/75',
      },
    }"
  >
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <!-- Icon Section -->
          <div class="flex-shrink-0 p-2 rounded-lg" :class="iconContainerClass">
            <component
              :is="iconComponent"
              class="w-5 h-5"
              :class="iconColorClass"
            />
          </div>

          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
          </div>

          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="closeModal"
          />
        </div>
      </template>

      <p class="text-gray-600 dark:text-gray-300 mb-4">
        {{ description }}
      </p>

      <div v-if="requiresPassword" class="mb-4">
        <UFormGroup label="Password" name="password">
          <UInput
            v-model="password"
            type="password"
            placeholder="Enter your password to confirm"
            :disabled="isLoading"
            @keyup.enter="confirmAction"
          />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            color="gray"
            variant="ghost"
            :disabled="isLoading"
            @click="closeModal"
          >
            Cancel
          </UButton>
          <UButton
            :color="confirmColor"
            :loading="isLoading"
            @click="confirmAction"
          >
            {{ confirmText }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { computed, h, ref, resolveComponent, watch } from "vue";

interface Props {
  title: string;
  description: string;
  confirmText?: string;
  confirmColor?: string;
  requiresPassword?: boolean;
  icon?: string;
  iconType?: "heroicon" | "svg";
  showBodyIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: "Confirm",
  confirmColor: "red",
  requiresPassword: false,
  icon: "",
  iconType: "svg",
  showBodyIcon: false,
});

const emit = defineEmits<{
  (event: "confirm", password?: string): void;
  (event: "close"): void;
}>();

const isOpen = defineModel<boolean>("open", { required: true });
const isLoading = defineModel<boolean>("loading", { default: false });
const password = ref("");

// Icon classes based on confirmation color
const iconContainerClass = computed(() => {
  const base = "p-2 rounded-lg";
  const colors = {
    red: "bg-red-100 dark:bg-red-900/20",
    blue: "bg-blue-100 dark:bg-blue-900/20",
    green: "bg-green-100 dark:bg-green-900/20",
    gray: "bg-gray-100 dark:bg-gray-800",
  };
  return `${base} ${colors[props.confirmColor] || colors.red}`;
});

const iconColorClass = computed(() => {
  const colors = {
    red: "text-red-600 dark:text-red-400",
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    gray: "text-gray-600 dark:text-gray-400",
  };
  return colors[props.confirmColor] || colors.red;
});

// Resolve icon component
const iconComponent = computed(() => {
  if (!props.icon) {
    // Default icons based on action type
    if (props.confirmColor === "red") return resolveComponent("IconDanger");
    if (props.confirmColor === "blue") return resolveComponent("IconLogout");
    if (props.confirmColor === "green") return resolveComponent("IconSuccess");
    return resolveComponent("IconQuestion");
  }

  if (props.iconType === "heroicon") {
    return () => h("div", { class: props.icon });
  }

  return resolveComponent(props.icon);
});

const closeModal = () => {
  isOpen.value = false;
  password.value = "";
  emit("close");
};

const confirmAction = () => {
  if (props.requiresPassword && !password.value) {
    return;
  }

  emit("confirm", props.requiresPassword ? password.value : undefined);
};

// Reset password when modal closes
watch(isOpen, (newVal) => {
  if (!newVal) {
    password.value = "";
  }
});
</script>
