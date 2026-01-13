<template>
  <Teleport to="body">
    <div class="fixed lg:z-[100] z-[40] inset-0 pointer-events-none">
      <div
        :class="drawerClass"
        class="inset-y-0 break-words absolute pointer-events-auto z-[40] transition-all duration-300 ease-in-out bg-[white] w-[75%] min-h-screen overflow-x-hidden overflow-y-auto mt-[122px] lg:mt-0"
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
  placement: {
    type: String,
    default: "",
  },
  classList: {
    type: String,
    default: "",
  },
});

const getScrollbarWidth = () =>
  window.innerWidth - document.documentElement.clientWidth;

const drawerClass = computed(() => {
  let classes = show.value
    ? "visible opacity-100 pointer-events-auto"
    : "invisible opacity-0 pointer-events-none";
  classes +=
    props.placement === "left"
      ? show.value
        ? " left-0"
        : " -left-full"
      : show.value
      ? " right-0"
      : " -right-full";
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
