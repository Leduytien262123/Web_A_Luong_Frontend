<script setup>
const router = useRouter();
</script>

<template>
  <div class="text-center pt-24 text-title">
    <p class="text-2xl uppercase">Không tìm thấy trang Web</p>
    <button
      class="mt-10 border px-6 py-2 rounded-md hover:opacity-80"
      @click="router.back()"
    >
      <span>Quay lại</span>
    </button>
  </div>
</template>

<style></style>
