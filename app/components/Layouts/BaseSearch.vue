<template>
  <Teleport to="body">
    <div class="fixed z-[200] inset-0 pointer-events-none">
      <div
        :class="drawerClass"
        class="absolute left-1/2 transform -translate-x-1/2 bg-white w-[705px] h-[86px] rounded-2xl shadow-lg flex items-center justify-center transition-transform duration-300 ease-in-out z-[200]"
      >
        <slot />
      </div>

      <div
        v-if="searchQuery && searchResults.length > 0"
        :class="drawerClassSearch"
        class="bg-white absolute z-[200] md:w-[705px] md:left-1/2 md:transform md:-translate-x-1/2 w-full rounded-2xl p-[15px] space-y-2 text-secondary border border-gray-200"
      >
        <div
          v-for="(result, index) in searchResults"
          :key="index"
          class="cursor-pointer"
        >
          <div @click="onResultClick(result)" class="">
            {{ result.name }}
          </div>
        </div>
      </div>

      <div
        v-else-if="searchQuery && searchResults.length === 0"
        :class="drawerClassSearch"
        class="bg-white absolute z-[200] md:w-[705px] md:left-1/2 md:transform md:-translate-x-1/2 w-full rounded-2xl p-[15px] space-y-2 text-secondary border border-gray-200"
      >
        Không tìm thấy kết quả nào
      </div>
      <div :class="overlayClass" @click="show = !show"></div>
    </div>
  </Teleport>
</template>

<script setup>
const show = defineModel("show");
const props = defineProps({
  classList: {
    type: String,
    default: "",
  },
  placement: {
    type: String,
    default: "",
  },
  searchResults: {
    type: Array,
    default: () => [],
  },
  searchQuery: {
    type: String,
    default: null,
  },
});
const getScrollbarWidth = () =>
  window.innerWidth - document.documentElement.clientWidth;

const drawerClass = computed(() => {
  let classes = show.value
    ? "translate-y-[calc(100vh/5)] visible opacity-100 pointer-events-auto"
    : "translate-y-full invisible opacity-0 pointer-events-none";
  classes += " " + props.classList;
  return classes;
});

const drawerClassSearch = computed(() => {
  let classes = show.value
    ? "translate-y-[calc(100vh/4)] visible opacity-100 pointer-events-auto mt-11  scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
    : "translate-y-full invisible opacity-0 pointer-events-none";
  classes += " " + props.classList;
  return classes;
});

const overlayClass = computed(() => {
  return show.value
    ? "opacity-25 pointer-events-auto bg-black fixed top-0 left-0 w-screen h-screen z-30 block"
    : "pointer-events-none";
});

// watch(
//   () => show.value,
//   (newValue) => {
//     const htmlElement = document.querySelector("html");
//     const SW = getScrollbarWidth();
//     htmlElement.style.overflow = newValue ? "hidden" : "";
//     htmlElement.style.marginRight = newValue ? SW + "px" : "";
//   }
// );

onBeforeUnmount(() => {
  const htmlElement = document.querySelector("html");
  htmlElement.style.overflow = "";
  htmlElement.style.marginRight = "";
});

const searchResults = computed(() => props.searchResults || []);
const searchQuery = computed(() => props.searchQuery || null);

const emit = defineEmits(["close"]);

const onResultClick = (result) => {
  navigateTo(`/search/${result?.slug}`);
  emit("close"); // Thông báo component cha đóng modal
};
</script>
