<script setup>
const { picked, value } = defineProps({
  value: {
    type: String,
    default: "",
  },
  picked: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="cursor-pointer" @click="$emit('onClickRadio')">
    <RadioPick v-if="picked === value" class="-my-[14px] lg:my-0" />
    <div v-else class="lg:p-3.5 px-3.5">
      <Radio />
    </div>
    <slot />
  </div>
</template>

<style></style>
