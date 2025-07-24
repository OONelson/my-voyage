<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    :fill="fillColor"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M6 2v14a2 2 0 0 0 2 2h14" />
      <path d="M18 22V8a2 2 0 0 0-2-2H2" />
    </g>
  </svg>
</template>

<script lang="ts">
export default {
  name: "CropIcon",
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
