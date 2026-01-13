<template>
  <Teleport to="body">
    <div class="fixed z-50 inset-0 pointer-events-none">
      <div
        :class="drawerClass"
        class="absolute left-1/2 transform -translate-x-1/2 bg-white w-[705px] h-[86px] rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out z-50"
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
});

const getScrollbarWidth = () =>
  window.innerWidth - document.documentElement.clientWidth;

const drawerClass = computed(() => {
  let classes = show.value
    ? "translate-y translate-y-[calc(100vh/5)] visible opacity-100 pointer-events-auto"
    : "translate-y-[100vh] invisible opacity-0 pointer-events-none";
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
</script>
