<script setup>
defineProps({
  links: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div v-if="links.length > 0" class="text-base flex items-center">
    <div class="w-full line-clamp-1 break-all">
      <span class="text-gray-500"><NuxtLink to="/">Trang chủ</NuxtLink></span>
      <span
        v-for="(link, index) in links"
        :key="index"
        class="text-gray-500"
        :class="Number(index) === links?.length - 1 ? 'text-gray-700' : ''"
      >
        <span v-if="link?.disabled || Number(index) === links?.length - 1">{{
          link?.label
        }}</span>
        <NuxtLink v-else :to="`${link?.to}`">{{ link?.label }}</NuxtLink>
      </span>
    </div>
  </div>
</template>

<style scoped>
.label-breadcrumb:not(:last-child)::after {
  content: "\276F";
  padding-right: 0.75rem;
  padding-left: 0.75rem;
  font-family: "Helvetica Neue", sans-serif;
}
</style>
