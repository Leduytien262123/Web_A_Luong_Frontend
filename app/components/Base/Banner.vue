<script setup>
const img = useImage();
const backgroundStyles = computed(() => {
  const imgUrl = img("/img/banner.png", { format: "webp" });
  return { backgroundImage: `url('${imgUrl}')` };
});
</script>

<template>
  <div
    :style="backgroundStyles"
    class="banner bg-cover bg-center min-h-[360px]"
  ></div>
</template>

<style scoped>
.banner {
  min-height: 600px;
  background-repeat: no-repeat;
}
</style>
