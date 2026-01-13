<script setup>
const { vertical } = defineProps({
  vertical: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    :class="
      vertical
        ? 'border-l border-gray-300 h-full'
        : 'border-t border-gray-300 w-full'
    "
  ></div>
</template>
