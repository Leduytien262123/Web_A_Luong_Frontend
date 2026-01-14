<template>
  <div ref="sectionRef" class="xl:pb-[130px] lg:pb-20 pb-[50px]">
    <div class="sm:flex items-center justify-between">
      <div
        v-if="isVisibleNews"
        :class="{ 'animRight reveal active': isVisibleNews }"
        class="flex items-center flex-wrap"
      >
        <h2 class="text-title lg:text-[28px] text-2xl font-medium mr-2">
          Mua sim du lịch tại
        </h2>
        <h2 class="text-primary lg:text-[28px] text-2xl font-medium">
          sim.wifi247.vn
        </h2>
      </div>
      <button
        v-if="isVisibleNews"
        class="py-3 px-6 border border-[#39B54A] rounded-full flex items-center hover:scale-110 transition duration-300 ease-in-out mt-3 lg:mt-0"
        :class="{ 'animLeft reveal active': isVisibleNews }"
        @click="showModalTel = true"
      >
        <span class="mr-2 text-primary">Liên hệ ngay</span>
        <Calling2 />
      </button>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-start xl:gap-x-[30px] gap-x-5 mt-[35px]"
    >
      <div v-for="(item, index) in items" :key="index" class="">
        <div
          v-if="isVisibleItems[index]"
          :class="{ 'animTop reveal active': isVisibleItems[index] }"
          class="col-span-1 rounded-2xl flex flex-col lg:py-6 xl:px-6 lg:px-4 py-4 lg:min-h-[277px] xl:min-h-[253px] xl:h-full my-2.5 lg:my-0 top-0 px-[14px] hover:bg-[#DBEFDE] hover:scale-105 transition duration-300 ease-in-out lg:items-start lg:justify-center bg-[#F2F2F2]"
        >
          <div class="flex lg:block">
            <div
              class="flex items-center justify-center relative mr-[15px] lg:mr-0"
            >
              <img
                :src="item.image || '/img/empty.jpg'"
                alt="image"
                class="min-w-20 min-h-20 object-cover"
              />
              <img
                :src="item.icon || '/img/empty.jpg'"
                alt="icon"
                class="absolute"
              />
            </div>
            <div class="lg:mt-[15px]">
              <div class="lg:text-center mb-2.5 text-xl text-title font-medium">
                {{ item.title }}
              </div>
              <span
                class="text-base lg:text-center text-secondary line-clamp-3 lg:line-clamp-none"
                v-html="sanitizedItems[index]"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showModalTel"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] transition-opacity duration-500 opacity-0"
      :class="{ 'opacity-100': showModalTel }"
      @click.self="handleModalTel"
    >
      <div
        class="bg-white rounded-lg p-6 w-96 transform transition-all duration-300 ease-out"
        :class="{
          'translate-y-4 opacity-0': !showModalTel,
          'translate-y-0 opacity-100': showModalTel,
        }"
      >
        <div class="w-full flex justify-end">
          <CloseBlack class="cursor-pointer" @click="handleModalTel" />
        </div>
        <h3 class="text-lg font-semibold text-title text-center mb-4">
          Gọi điện cho chúng tôi
        </h3>
        <div class="flex flex-col space-y-4">
          <a href="tel:0903210101">
            <button class="bg-primary text-white py-2 px-4 rounded w-full">
              <div class="flex flex-col items-center align-center min-w-[60px]">
                Hà Nội
              </div>
            </button>
          </a>
          <a href="tel:0914261999">
            <button class="bg-primary text-white py-2 px-4 rounded w-full">
              <div class="flex flex-col items-center align-center min-w-[60px]">
                Hồ Chí Minh
              </div>
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isVisibleItems = ref([false, false, false, false]);
const isVisibleNews = ref(false);
const sectionRef = ref(null);

const items = ref([
  {
    image: "/img/nhu-cau.png",
    icon: "/svg/nhu-cau.svg",
    title: "Phù hợp mọi nhu cầu",
    content: `Đa dạng lựa chọn dung lượng, số ngày, SIM hoặc eSIM phù hợp với mọi nhu cầu.`,
  },
  {
    image: "/img/bao-hanh.png",
    icon: "/svg/bao-hanh.svg",
    title: "Bảo hành uy tín",
    content: `Đảm bảo hoàn tiền 100% nếu SIM hoặc eSIM của bạn bị lỗi từ phía Sim 247.`,
  },
  {
    image: "/img/chi-phi.png",
    icon: "/svg/chi-phi.svg",
    title: "Chi phí tiết kiệm",
    content: `Mức giá cạnh tranh, tiết kiệm hơn so với khi bạn mua gói cước ở nước ngoài.`,
  },
  {
    image: "/img/dich-vu.png",
    icon: "/svg/dich-vu.svg",
    title: "Dịch vụ đồng hành",
    content: `Đội ngũ nhân viên hỗ trợ online 24/7 trong suốt quá trình của bạn.`,
  },
]);

const sanitizedItems = ref(items.value.map(() => ""));
let _dompurify = null;

onMounted(async () => {
  try {
    _dompurify = (await import("dompurify")).default;
    sanitizedItems.value = items.value.map((i) =>
      _dompurify.sanitize(i.content)
    );
  } catch (e) {
    sanitizedItems.value = items.value.map(() => "");
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          isVisibleNews.value = true;
          items.value.forEach((_, index) => {
            setTimeout(() => {
              isVisibleItems.value[index] = true;
            }, index * 250);
          });
          observer.disconnect();
        }, 500);
      }
    },
    { threshold: 0.1 }
  );
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});

watch(
  items,
  (newItems) => {
    if (_dompurify) {
      sanitizedItems.value = newItems.map((i) =>
        _dompurify.sanitize(i.content)
      );
    } else {
      sanitizedItems.value = newItems.map(() => "");
    }
  },
  { deep: true }
);

const showModalTel = ref(false);

const handleModalTel = () => {
  showModalTel.value = !showModalTel.value;
};

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          isVisibleNews.value = true;
          items.value.forEach((_, index) => {
            setTimeout(() => {
              isVisibleItems.value[index] = true;
            }, index * 250);
          });
          observer.disconnect();
        }, 500);
      }
    },
    { threshold: 0.1 }
  );
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>
