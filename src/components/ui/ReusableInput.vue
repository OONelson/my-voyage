<template>
  <div>
    <label v-if="label" :for="id" class="text-textblack100 font-medium">
      {{ label }}
    </label>

    <div class="relative flex justify-between items-center">
      <input
        :id="id"
        :type="showPassword ? 'text' : type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        @input="onInput"
        class="mt-1.5 mb-4 border rounded-lg shadow-sm min-w-[300px] xs:min-w-[360px] sm:min-w-[300px] md:min-w-[400px] lg:min-w-[450px] py-3 pl-3 pr-7 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-inputColor100 focus:bg-inputColor200"
      />

      <button
        v-if="hasToggle"
        type="button"
        @click="togglePasswordVisibility"
        class="w-min absolute right-1.5 top-1/2 transform -translate-y-1/2"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        <EyeIcon v-if="showPassword" fillColor="textblack100" />
        <EyeSlashIcon v-else fillColor="textblack100" />
      </button>
    </div>

    <!-- <div v-if="error" class="error-message">
      {{ error }}
    </div> -->
  </div>
</template>

<script setup lang="ts">
import EyeSlashIcon from "@/assets/icons/EyeSlashIcon.vue";
import EyeIcon from "@/assets/icons/EyeIcon.vue";
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: String,
  label: String,
  id: String,
  name: String,
  type: { type: String, default: "text" },
  placeholder: String,
  disabled: Boolean,
  required: Boolean,
  showPasswordToggle: { type: Boolean, default: false },
});

const emits = defineEmits(["update:modelValue"]);

const localShowPassword = ref(false);

const hasToggle = computed(() => {
  return props.type === "password" && props.showPasswordToggle;
});

const showPassword = computed(() => {
  return hasToggle.value ? localShowPassword.value : false;
});

const togglePasswordVisibility = () => {
  localShowPassword.value = !localShowPassword.value;
};

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emits("update:modelValue", target.value);
};
</script>
