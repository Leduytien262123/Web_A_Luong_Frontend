<script setup>
const { disabled } = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    class="text-white border-none cursor-pointer"
    :class="
      disabled
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-primary hover:opacity-80'
    "
    :disabled="disabled"
    @click="$emit('onClickBtn')"
  >
    <slot />
  </button>
</template>
