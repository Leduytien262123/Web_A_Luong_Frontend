<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const navigationItems = computed(() => {
  const mapItem = (item, parentPath = "/categories") => {
    const path = `${parentPath}/${item.slug}`;
    const node = {
      label: item.name,
      to: path,
    };
    if (item.children && item.children.length > 0) {
      node.children = item.children.map((c) => mapItem(c, path));
    }
    return node;
  };

  return (props.items || []).map((it) => mapItem(it));
});
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :items="navigationItems"
    class="w-full"
  />
</template>

<style scoped></style>
