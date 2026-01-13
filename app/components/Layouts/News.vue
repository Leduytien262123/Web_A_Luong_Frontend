<script setup>
import { SwiperSlide } from "swiper/vue";
const { restAPI } = useApi();

const isVisible = ref(false);
const isVisibleNews = ref(false);
const sectionRef = ref(null);

const route = useRoute();
const currentPath = route.path;
const isTinTuc = currentPath.includes("/tin-tuc");

const { data: resDataNews } = await restAPI.stores.getBlogs({
  params: {
    current: 1,
    pageSize: 5,
  },
});
const news = resDataNews?.value?.data;

const containerRef = ref(null);

const swiper = useSwiper(containerRef, {
  effect: "creative",
  loop: true,
});

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          isVisibleNews.value = true;
          setTimeout(() => {
            isVisible.value = true;
          }, 2000);
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

<template>
  <div ref="sectionRef" v-if="news.length > 0" class="mt-20 lg:mt-[100px]">
    <div class="text-title text-[28px] text-center mb-10 font-medium">
      <span v-if="!isTinTuc" class="">Tin tức</span>
      <span v-else class="">Có thể bạn quan tâm</span>
    </div>

    <div
      v-if="isVisibleNews"
      :class="{ 'animZoomIn reveal active': isVisibleNews }"
      class="relative"
      style="animation-duration: 4s"
    >
      <ClientOnly>
        <swiper-container
          ref="containerRef"
          :loop="true"
          :autoplay="{ delay: 4000 }"
          :init="true"
          :slides-per-view="1"
          :space-between="20"
          :breakpoints="{
            430: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            660: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1000: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1001: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1160: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }"
        >
          <SwiperSlide v-for="item in news" :key="item.id">
            <div
              @click="navigateTo(`/tin-tuc/${item.slug}`)"
              class="cursor-pointer place-items-stretch"
            >
              <div class="relative rounded-xl">
                <img
                  :src="item.feature_image?.[0]?.src || '/img/empty.jpg'"
                  :alt="item.feature_image?.[0]?.alt || 'No image'"
                  class="w-full aspect-[1.5] rounded-xl object-cover"
                />
                <div
                  v-if="item?.published_at"
                  class="absolute bg-white px-2 py-[7px] text-secondady font-light rounded-lg left-3 bottom-2.5"
                >
                  {{ formatDate(item?.published_at) }}
                </div>
              </div>
              <div class="rounded-xl bg-[#DBEFDE] p-3 mt-3 min-h-[192px]">
                <div class="text-primary line-clamp-2 font-medium">
                  {{ item?.name }}
                </div>
                <div
                  v-html="item?.description"
                  class="text-secondary mt-2 line-clamp-4 description-blog"
                ></div>
              </div>
            </div>
          </SwiperSlide>
        </swiper-container>
      </ClientOnly>
      <div
        class="absolute flex justify-between top-1/2 -left-16 -right-16"
        :class="{ hidden: news.length <= 4 }"
      >
        <PrevProduct
          class="cursor-pointer click-swiper"
          @click="swiper.prev()"
        />

        <NextProduct
          class="cursor-pointer click-swiper"
          @click="swiper.next()"
        />
      </div>
    </div>

    <div v-if="!isTinTuc" class="text-center mt-10">
      <ButtonBase
        @click="navigateTo(`/tin-tuc`)"
        v-if="isVisible"
        :class="{ 'animTop reveal active': isVisible }"
        class="px-[30px] py-4 mx-auto rounded-[27px] flex items-center"
        style="animation-duration: 1.2s"
      >
        <ViewAllNews />
        <span class="ml-2">Xem tất cả tin tức</span>
      </ButtonBase>
    </div>
    <div v-else class="text-center mt-10 lg:hidden">
      <ButtonBase
        @click="navigateTo(`/tin-tuc`)"
        v-if="isVisible"
        :class="{ 'animTop reveal active': isVisible }"
        class="px-[30px] py-4 mx-auto rounded-[27px] flex items-center"
      >
        <ViewAllNews />
        <span class="ml-2">Xem tất cả tin tức</span>
      </ButtonBase>
    </div>
  </div>
</template>

<style scoped lang="css">
@media (max-width: 1340px) {
  .click-swiper {
    display: none;
  }
}

:deep(.description-blog > *) {
  @apply !text-base;
}
</style>
