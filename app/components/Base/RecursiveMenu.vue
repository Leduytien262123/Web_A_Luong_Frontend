<script setup lang="ts">
interface MenuItem {
  label: string;
  to?: string;
  children?: MenuItem[];
}

defineProps<{
  items: MenuItem[];
  level?: number;
}>();

const openMap = reactive<Record<string, boolean>>({});
</script>

<template>
  <ul class="space-y-1">
    <li v-for="item in items" :key="item.to">
      <!-- ITEM -->
      <div
        class="flex items-center justify-between cursor-pointer rounded px-3 py-2 hover:bg-gray-100"
        @click="item.children && (openMap[item.to!] = !openMap[item.to!])"
      >
        <NuxtLink v-if="item.to" :to="item.to" class="flex-1">
          {{ item.label }}
        </NuxtLink>

        <span v-if="item.children" class="text-sm">
          {{ openMap[item.to!] ? "▾" : "▸" }}
        </span>
      </div>

      <!-- CHILDREN -->
      <div
        v-if="item.children && openMap[item.to!]"
        class="pl-4 border-l border-gray-200"
      >
        <RecursiveMenu :items="item.children" :level="(level ?? 0) + 1" />
      </div>
    </li>
  </ul>
</template>
