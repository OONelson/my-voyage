<template>
  <div class="relative">
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :minlength="minlength"
      :pattern="pattern"
      :readonly="readonly"
      class="w-full px-3 py-2 border border-gray-300 dark:border-dark-border100 rounded-md shadow-sm bg-white dark:bg-dark-background100 text-gray-900 dark:text-dark-textblack200 placeholder-gray-500 dark:placeholder-dark-textblack50 focus:outline-none focus:ring-1 focus:ring-accent200 dark:focus:ring-dark-accent200 focus:border-accent200 dark:focus:border-dark-accent200 disabled:bg-gray-100 dark:disabled:bg-dark-background200 disabled:text-gray-500 dark:disabled:text-dark-textblack50 disabled:cursor-not-allowed transition-colors duration-200"
      :class="[
        error
          ? 'border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400'
          : '',
        success
          ? 'border-green-500 dark:border-green-400 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400'
          : '',
        inputClass,
      ]"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @keydown="handleKeydown"
    />

    <!-- Success Icon -->
    <div
      v-if="success"
      class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
    >
      <svg
        class="h-5 w-5 text-green-500 dark:text-green-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <!-- Error Icon -->
    <div
      v-if="error"
      class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
    >
      <svg
        class="h-5 w-5 text-red-500 dark:text-red-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>

  <!-- Error Message -->
  <p
    v-if="error && errorMessage"
    class="mt-1 text-sm text-red-600 dark:text-red-400"
  >
    {{ errorMessage }}
  </p>

  <!-- Help Text -->
  <p
    v-if="helpText && !error"
    class="mt-1 text-sm text-gray-500 dark:text-dark-textblack50"
  >
    {{ helpText }}
  </p>
</template>

<script setup lang="ts">
interface Props {
  id?: string;
  modelValue?: string | number;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  autocomplete?: string;
  maxlength?: number;
  minlength?: number;
  pattern?: string;
  error?: boolean;
  success?: boolean;
  errorMessage?: string;
  helpText?: string;
  inputClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  required: false,
  readonly: false,
  error: false,
  success: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = props.type === "number" ? Number(target.value) : target.value;
  emit("update:modelValue", value);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};

const handleFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const handleKeydown = (event: KeyboardEvent) => {
  emit("keydown", event);
};
</script>
