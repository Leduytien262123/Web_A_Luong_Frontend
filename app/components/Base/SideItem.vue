<script setup>
const props = useAttrs();
</script>

<template>
  <div class="bg-white rounded-xl">
    <div class="background-primary flex items-center py-3 px-7 rounded-xl">
      <img
        class="mr-2.5"
        :src="props.icon || '/img/empty.jpg'"
        alt="side-icon"
      />
      <p class="text-xl text-white uppercase line-clamp-1">{{ props.title }}</p>
    </div>
    <div class="py-6 px-[1.125rem]">
      <slot />
    </div>
  </div>
</template>

<style></style>
