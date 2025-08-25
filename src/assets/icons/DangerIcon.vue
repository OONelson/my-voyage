<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    :width="size"
    :height="size"
    :stroke="fillColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
</template>
<script lang="ts">
export default {
  name: "LogoutIcon",
  props: {
    fillColor: {
      type: String,
      default: "#f4f4f4",
    },
    size: {
      default: "24",
    },
  },
};
</script>
