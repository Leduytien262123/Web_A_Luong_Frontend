<template>
  <section
    v-if="dataContent"
    ref="targetRef"
    class="section-container bg-white text-center py-[80px]"
  >
    <div>
      <h1 class="text-[50px] font-bold">{{ dataContent.title }}</h1>
      <p class="text-[#808080] mb-10 mt-2">
        {{ dataContent.description }}
      </p>
    </div>
    <div class="grid grid-cols-12 gap-5">
      <div
        v-for="(item, index) in dataContent?.metadata || []"
        :key="item.title"
        v-motion
        class="col-span-12 md:col-span-6 lg:col-span-3 trait-item mb-4 text-center"
        :initial="{ opacity: 0, y: 20 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: index * 0.08,
          },
        }"
      >
        <div
          class="trait-item-round"
          :class="[
            'w-[145px] transition-all h-[145px] m-[auto] rounded-full border-[10px] border-slate-100 flex items-center justify-center',
          ]"
        >
          <div class="h-[60px] w-[60px] flex items-center justify-center">
            <svg
              v-if="item.icon === 'ph:monitor'"
              class="h-[60px] w-[60px]"
              :style="{ color: item.color }"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path
                d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24h72v16H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V200h72a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Z"
              />
            </svg>
            <svg
              v-else-if="item.icon === 'ph:cd'"
              class="h-[60px] w-[60px]"
              :style="{ color: item.color }"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path
                d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm0-144a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128,72Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128,168Zm0-56a16,16,0,1,0,16,16A16,16,0,0,0,128,112Z"
              />
            </svg>
            <svg
              v-else-if="item.icon === 'ph:planet'"
              class="h-[60px] w-[60px]"
              :style="{ color: item.color }"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path
                d="M245.11,60.68c-7.65-13.19-27.84-16.16-58.5-8.66A95.93,95.93,0,0,0,32,128a98,98,0,0,0,1.82,18.63c-24.73,0-42.52,10.51-50.16,23.69-3.48,6-4.06,12.06-1.72,18,4.44,11.3,18.94,17.42,40.84,17.42,13.75,0,28.87-2.41,44.2-5.47a95.78,95.78,0,0,0,86.76,19.95c30.66,7.5,50.85,4.54,58.5-8.66S250.5,167.53,245.11,60.68ZM128,208a80.11,80.11,0,0,1-80-80,79.69,79.69,0,0,1,10-38.67c2.67,0,5.39.09,8.16.26A175.36,175.36,0,0,0,128,206.36,80.05,80.05,0,0,1,128,208Z"
              />
            </svg>
            <svg
              v-else
              class="h-[60px] w-[60px]"
              :style="{ color: item.color }"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path
                d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a12,12,0,1,1-12-12A12,12,0,0,1,168,148Zm-56,0a12,12,0,1,1-12-12A12,12,0,0,1,112,148Zm68.48-23.52c-7.73-7.73-19.27-10.57-30.48-10.57s-22.75,2.84-30.48,10.57a8,8,0,0,1-11.31-11.31c10.27-10.28,25.42-14.69,41.79-14.69s31.52,4.41,41.79,14.69a8,8,0,0,1-11.31,11.31Z"
              />
            </svg>
          </div>
        </div>
        <h5 class="text-[17px] relative font-bold mt-[20px] mb-4">
          {{ item.title }}
        </h5>
        <p class="text-[14px] text-[#808080] text-center leading-6">
          {{ item.des }}
        </p>
      </div>
    </div>
  </section>
</template>
<script setup>
const props = defineProps({
  sectionData: {
    type: Object,
    required: true,
  },
});

const dataContent = computed(() => props.sectionData || null);
</script>
<style scoped>
.trait-item {
  h5 {
    &:before {
      position: absolute;
      z-index: 1;
      content: "";
      width: 20%;
      height: 2px;
      bottom: -5px;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
}
.trait-item:nth-child(1) {
  h5 {
    &:before {
      background-color: #e96656;
    }
  }
  .trait-item-round {
    &:hover {
      border-color: #e96656;
    }
  }
}

.trait-item:nth-child(2) {
  h5 {
    &:before {
      background-color: #34d293;
    }
  }
  .trait-item-round {
    &:hover {
      border-color: #34d293;
    }
  }
}

.trait-item:nth-child(3) {
  h5 {
    &:before {
      background-color: #3ab0e2;
    }
  }
  .trait-item-round {
    &:hover {
      border-color: #3ab0e2;
    }
  }
}

.trait-item:nth-child(4) {
  h5 {
    &:before {
      background-color: #f7d861;
    }
  }
  .trait-item-round {
    &:hover {
      border-color: #f7d861;
    }
  }
}
</style>
