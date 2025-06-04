<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :fill="fillColor"
    :width="size"
    :height="size"
  >
    <path
      d="M16.175 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.175l-4.9-4.9q-.3-.3-.288-.7t.313-.7q.3-.275.7-.288t.7.288l6.6 6.6q.15.15.213.325t.062.375-.062.375-.213.325l-6.6 6.6q-.275.275-.687.275T11.3 19.3q-.3-.3-.3-.712t.3-.713z"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: "ArrowFoward",
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
