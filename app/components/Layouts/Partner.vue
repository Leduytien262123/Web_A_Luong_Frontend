<script setup>
const { restAPI } = useApi();
const isVisible = ref(false);
const sectionRef = ref(null);

const { data: resData } = await restAPI.stores.getPartners({
  params: {
    current: 1,
    pageSize: 9999,
  },
});

const partner = resData.value?.data;

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          isVisible.value = true;
          observer.disconnect();
        }, 1000);
      }
    },
    { threshold: 0.5 }
  );
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>

<template>
  <div ref="sectionRef" v-if="partner.length > 0" class="lg:mt-[100px] mt-20">
    <div class="text-title text-[28px] text-center mb-10 font-medium">
      Đối tác của chúng tôi.
    </div>
    <div
      class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:gap-x-[30px] gap-x-4 gap-y-[20px]"
    >
      <div
        class="hidden lg:block"
        v-for="item in partner.slice(0, 12)"
        :key="item.id"
      >
        <div
          class="flex items-center justify-center hover:bg-[#DBEFDE] hover:scale-110 transition duration-300 ease-in-out"
          v-if="isVisible"
          :class="{ 'animTop reveal active': isVisible }"
        >
          <img
            :src="item?.image || '/img/empty.jpg'"
            :alt="item?.alt || 'img empty'"
            class="w-full h-auto aspect-[2.0] object-cover"
          />
        </div>
      </div>

      <div
        v-for="item in partner.slice(0, 8)"
        :key="item.id"
        class="hidden sm:block lg:hidden"
      >
        <div
          class="hover:bg-[#DBEFDE] hover:scale-110 transition duration-300 ease-in-out"
          v-if="isVisible"
          :class="{ 'animTop reveal active': isVisible }"
        >
          <img
            :src="item?.image || '/img/empty.jpg'"
            :alt="item?.alt || 'img empty'"
            class="w-full h-auto aspect-[2.0] object-cover"
          />
        </div>
      </div>

      <div v-for="item in partner.slice(0, 6)" :key="item.id" class="sm:hidden">
        <div
          class="flex items-center justify-center hover:bg-[#DBEFDE] hover:scale-110 transition duration-300 ease-in-out"
          v-if="isVisible"
          :class="{ 'animTop reveal active': isVisible }"
        >
          <img
            :src="item?.image || '/img/empty.jpg'"
            :alt="item?.alt || 'img empty'"
            class="w-full h-auto aspect-[2.0] object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>
