<template>
  <section
    ref="targetRef"
    class="pt-[90px] pb-[120px] text-center bg-[#000000]/[0.4] section-container"
  >
    <div class="grid grid-cols-12 gap-5">
      <div
        v-for="(item, index) in compData.items"
        :key="item.title"
        class="col-span-12 md:col-span-6 lg:col-span-3"
        v-bind="springUp(index * 0.12 + 0.15)"
      >
        <div class="mt-[30px]">
          <div class="circle flex items-center justify-center">
            <svg
              v-if="item.icon === 'ph:users-three'"
              class="h-[40px] w-[40px]"
              :style="{ color: item.color }"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path
                d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"
              />
            </svg>
            <svg
              v-else-if="item.icon === 'ph:user-plus'"
              class="h-[40px] w-[40px]"
              :style="{ color: item.color }"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path
                d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"
              />
            </svg>
            <svg
              v-else-if="item.icon === 'ph:at'"
              class="h-[40px] w-[40px]"
              :style="{ color: item.color }"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path
                d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"
              />
            </svg>
            <svg
              v-else
              class="h-[40px] w-[40px]"
              :style="{ color: item.color }"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path
                d="M128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152Zm61.66-77.66a8,8,0,0,1,0,11.32l-184,184a8,8,0,0,1-11.32-11.32l184-184A8,8,0,0,1,189.66,74.34ZM216,40a8,8,0,0,0-8,8v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V72h8a8,8,0,0,0,0-16h-8V48A8,8,0,0,0,216,40Z"
              />
            </svg>
          </div>
          <h5
            class="font-bold text-[17px] text-white relative mt-[15px] mb-[20px]"
          >
            {{ (animatedValues[index] ?? item.to).toLocaleString() }}
          </h5>
          <p class="text-[#d1d1d1]">{{ item.title }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
const compData = reactive({
  items: [
    {
      title: "Dự án đã hoàn thành",
      icon: "ph:users-three",
      from: 0,
      to: 2990,
      color: "#e96656",
    },
    {
      title: "Khách hàng hài lòng",
      icon: "ph:user-plus",
      from: 0,
      to: 1202,
      color: "#34d293",
    },
    {
      title: "Cuộc trò chuyện qua email",
      icon: "ph:at",
      from: 0,
      to: 3600,
      color: "#3ab0e2",
    },
    {
      title: "Ảnh đã chụp",
      icon: "ph:leaf",
      from: 0,
      to: 5639,
      color: "#f7d861",
    },
  ],
});
const animatedValues = ref([]);

const animateValue = (index, from, to) => {
  const start = performance.now();
  const duration = 1200;
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    animatedValues.value[index] = Math.floor(from + (to - from) * eased);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

watch(
  () => isVisible.value,
  (val) => {
    if (!val) return;
    animatedValues.value = compData.items.map(() => 0);
    compData.items.forEach((item, idx) => {
      animateValue(idx, item.from ?? 0, item.to);
    });
  }
);
</script>
<style scoped>
.section-container {
  h5 {
    &::before {
      position: absolute;
      z-index: 1;
      content: "";
      width: 20%;
      height: 2px;
      background: #f7d861;
      bottom: -8px;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
}
</style>
