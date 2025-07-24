<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :fill="fillColor"
    :width="size"
    :height="size"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </g>
  </svg>
</template>

<script lang="ts">
export default {
  name: "RotateLeft",
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
