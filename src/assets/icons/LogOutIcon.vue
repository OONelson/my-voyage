<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :fill="fillColor"
    :width="size"
    :height="size"
  >
    <path
      fill="none"
      :stroke="fillColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m16 17 5-5-5-5m5 5H9m0 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
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
