<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size">
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M8 2v4m8-4v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path
        d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"
      />
    </g>
  </svg>
</template>
<script lang="ts">
export default {
  name: "WhatTimeIcon",
  props: {
    size: {
      default: "18",
    },
  },
};
</script>
