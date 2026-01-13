<template>
  <Teleport to="body">
    <div class="fixed z-[200] inset-0 pointer-events-none mx-[30px]">
      <div
        :class="drawerClass"
        class="absolute left-1/2 transform -translate-x-1/2 bg-white w-full h-[158px] rounded-2xl shadow-lg flex items-center justify-center transition-transform duration-300 ease-in-out z-[200]"
      >
        <slot />
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

const overlayClass = computed(() => {
  return show.value
    ? "opacity-25 pointer-events-auto bg-black fixed top-0 left-0 w-screen h-screen z-30 block"
    : "pointer-events-none";
});

watch(
  () => show.value,
  (newValue) => {
    const htmlElement = document.querySelector("html");
    const SW = getScrollbarWidth();
    htmlElement.style.overflow = newValue ? "hidden" : "";
    htmlElement.style.marginRight = newValue ? SW + "px" : "";
  }
);

onBeforeUnmount(() => {
  const htmlElement = document.querySelector("html");
  htmlElement.style.overflow = "";
  htmlElement.style.marginRight = "";
});

const searchResults = computed(() => props.searchResults || []);

const emit = defineEmits(["close"]);

const onResultClick = (result) => {
  navigateTo(`/search/${result?.slug}`);
  emit("close"); // Thông báo component cha đóng modal
};
</script>
