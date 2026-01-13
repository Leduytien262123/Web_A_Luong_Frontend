<script setup></script>

<template>
  <button class="btn-more hover:opacity-80" @click="$emit('onClickViewMore')">
    <span class="text-lg line-clamp-1">Xem thêm</span>
  </button>
</template>

<style>
.btn-more {
  @apply py-2 px-6 md:py-3.5 md:px-10 bg-blue-500 text-white border-none rounded-lg cursor-pointer;
}
</style>
