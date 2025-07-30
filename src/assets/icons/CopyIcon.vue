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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </g>
  </svg>
</template>
<script lang="ts">
export default {
  name: "CopyIcon",
  props: {
    fillColor: {
      type: String,
      default: "#fff",
    },
    size: {
      default: "24",
    },
  },
};
</script>
