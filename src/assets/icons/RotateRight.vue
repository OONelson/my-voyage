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
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </g>
  </svg>
</template>

<script lang="ts">
export default {
  name: "RotateRight",
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
