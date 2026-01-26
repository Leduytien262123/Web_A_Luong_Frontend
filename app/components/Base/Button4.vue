<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "Xem tất cả",
  },
  width: {
    type: [String, Number],
    default: "150px",
  },
  height: {
    type: [String, Number],
    default: null,
  },
});

const title = computed(() => props.title);

const formatSize = (v) => {
  if (v === null || v === undefined) return null;
  return typeof v === "number" ? `${v}px` : String(v);
};

const buttonStyle = computed(() => {
  const w = formatSize(props.width ?? "150px");
  const h = formatSize(props.height);
  return {
    "--width": w,
    width: w,
    ...(h ? { height: h } : {}),
  };
});
</script>

<template>
  <button :style="buttonStyle">{{ title }}</button>
</template>
<style scoped>
button {
  --width: 150px;
  --timing: 2s;
  border: 0;
  width: var(--width);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.2em 1em;
  color: #fff;
  font-weight: bold;
  font-size: 1em;
  background: #b68258;
  transition: all 0.2s;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-image: linear-gradient(
    to right,
    rgb(250, 82, 82),
    rgb(250, 82, 82) 16.65%,
    rgb(190, 75, 219) 16.65%,
    rgb(190, 75, 219) 33.3%,
    rgb(76, 110, 245) 33.3%,
    rgb(76, 110, 245) 49.95%,
    rgb(64, 192, 87) 49.95%,
    rgb(64, 192, 87) 66.6%,
    rgb(250, 176, 5) 66.6%,
    rgb(250, 176, 5) 83.25%,
    rgb(253, 126, 20) 83.25%,
    rgb(253, 126, 20) 100%,
    rgb(250, 82, 82) 100%
  );
  animation: var(--timing) linear dance6123 infinite;
  transform: scale(1.1) translateY(-1px);
}

@keyframes dance6123 {
  to {
    background-position: var(--width);
  }
}
</style>
