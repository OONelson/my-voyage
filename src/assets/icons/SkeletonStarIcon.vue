<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    :fill="fillColor"
    viewBox="0 0 24 24"
  >
    <path
      d="m5.825 21 1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625 7.2.625-5.45 4.725L18.175 21 12 17.275z"
    />
  </svg>
</template>
<script lang="ts">
export default {
  props: {
    fillColor: {
      type: String,
      default: "#c7c9cc",
    },
    size: {
      type: String,
      default: "18",
    },
  },
};
</script>
