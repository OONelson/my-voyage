<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :fill="fillColor"
    :width="size"
    :height="size"
  >
    <path d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z" />
  </svg>
</template>
<script lang="ts">
export default {
  name: "Menu",
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
