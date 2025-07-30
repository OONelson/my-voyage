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
      <path d="M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </g>
  </svg>
</template>
<script lang="ts">
export default {
  name: "DownloadIcon",
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
