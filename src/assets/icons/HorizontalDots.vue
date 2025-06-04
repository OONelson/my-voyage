<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    :fill="fillColor"
    :width="size"
    :height="size"
  >
    <path
      d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: "HorizontalDots",
  props: {
    fillColor: {
      type: String,
      default: "#f4f4f4",
    },
    size: {
      default: "18",
    },
  },
};
</script>
