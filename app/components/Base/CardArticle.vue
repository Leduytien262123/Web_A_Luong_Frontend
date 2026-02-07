<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const router = useRouter();
const navigateTo = (path) => {
  if (!path) return;
  router.push(path);
};

const items = computed(() => {
  return props.items || [];
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    <div
      v-for="(item, index) in items"
      :key="item.slug || index"
      class="col-span-1"
    >
      <div class="h-full flex flex-col overflow-hidden bg-white">
        <div class="relative aspect-[4/3] overflow-hidden rounded-lg">
          <img
            :src="item.pic || '/img/empty.jpg'"
            :alt="item.alt || item.title"
            class="h-full w-full object-cover transition duration-500 hover:scale-[1.05]"
            loading="lazy"
          />
        </div>
        <div
          class="flex items-center justify-between mt-4 text-sm text-[#808080]"
        >
          <span>{{ item.time }}</span>
        </div>
        <h3
          class="mt-3 text-lg font-semibold leading-6 text-[#111] line-clamp-2 cursor-pointer"
          @click="navigateTo(`/articles/${item.slug}`)"
        >
          {{ item.title }}
        </h3>
        <div class="mt-2 flex flex-wrap gap-2 text-xs">
          <UBadge
            v-for="tag in item.tag"
            :key="tag"
            variant="soft"
            color="primary"
          >
            {{ tag }}
          </UBadge>
        </div>
        <!-- <div class="mt-auto pt-4 flex items-center justify-between">
          <div
            v-if="item?.member?.username"
            class="flex items-center gap-2 text-sm text-[#555]"
          >
            <UIcon name="ph:user" class="h-4 w-4" aria-hidden="true" />
            <span>{{ item?.member?.username || "" }}</span>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
