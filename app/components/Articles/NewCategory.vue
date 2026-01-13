<script setup>
import { SwiperSlide } from "swiper/vue";
const route = useRoute();
const checkMobile = ref(false);
if (route.name === "tin-tuc-slugDetailNew") {
  checkMobile.value = true;
}

const { restAPI } = useApi();

const { data: resData } = await restAPI.stores.getBlogCategories({
  params: {
    current: 1,
    pageSize: 9999,
  },
});

const categoriesNew = resData?.value?.data ?? [];

const { data: resDataTags } = await restAPI.stores.getBlogTags({
  params: {
    current: 1,
    pageSize: 10,
  },
});

const tags = resDataTags?.value?.data ?? [];

categoriesNew.sort((c1, c2) => {
  const pos1 = c1.position || 0;
  const pos2 = c2.position || 0;
  return pos1 - pos2;
});

const { data: resDataNew } = await restAPI.stores.getBlogs({
  params: {
    current: 1,
    pageSize: 5,
  },
});
const news = resDataNew?.value?.data ?? [];

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
</script>

<template>
  <div class="">
    <div class="px-[15px] py-[30px] bg-[#F2F2F2] rounded-2xl text-title">
      <div class="">
        <div class="text-lg font-medium mb-2">Danh mục bài viết</div>
        <div v-for="item in categoriesNew" :key="item.id" class="py-1">
          <h2
            @click="navigateTo(`/tin-tuc/category/${item.slug}`)"
            class="text-secondary text-base font-normal cursor-pointer hover:text-[#39B54A]"
          >
            {{ item.name }}
          </h2>
        </div>
      </div>
      <div class="mt-[26px] hidden lg:block">
        <div class="text-lg font-medium">Bài viết mới</div>
        <div v-for="item in news.slice(0, 3)" :key="item.id" class="my-3 flex">
          <img
            @click="navigateTo(`/tin-tuc/${item.slug}`)"
            :src="item.feature_image?.[0]?.src || '/img/empty.jpg'"
            :alt="item.feature_image?.[0]?.alt || 'No image'"
            class="max-w-[60px] max-h-[60px] aspect-[1.0] mr-2 rounded-lg cursor-pointer object-cover"
          />
          <div class="text-base">
            <div
              @click="navigateTo(`/tin-tuc/${item.slug}`)"
              class="leading-[1.35] line-clamp-3 cursor-pointer"
            >
              {{ item.name }}
            </div>
            <div v-if="item?.published_at" class="text-primary">
              {{ formatDate(item?.published_at) }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="!checkMobile" class="mt-[26px] lg:hidden pb-2">
        <ClientOnly>
          <swiper-container
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
            }"
          >
            <SwiperSlide v-for="item in news" :key="item.id">
              <div
                @click="navigateTo(`/tin-tuc/${item.slug}`)"
                class="cursor-pointer"
              >
                <div class="relative rounded-xl">
                  <img
                    :src="item.feature_image?.[0]?.src || '/img/empty.jpg'"
                    :alt="item.feature_image?.[0]?.alt || 'No-image'"
                    class="w-full aspect-[1.5] object-cover rounded-xl"
                  />
                  <div
                    v-if="item?.published_at"
                    class="absolute bg-white px-2 py-[7px] text-secondady font-light rounded-lg left-3 bottom-2.5"
                  >
                    {{ formatDate(item?.published_at) }}
                  </div>
                </div>
                <div class="rounded-xl bg-[#DBEFDE] p-3 mt-3 min-h-[192px]">
                  <div class="text-primary line-clamp-2">{{ item.name }}</div>
                  <div
                    v-html="item.description"
                    class="text-secondary mt-2 line-clamp-4"
                  ></div>
                </div>
              </div>
            </SwiperSlide>
          </swiper-container>
        </ClientOnly>
      </div>
      <div class="lg:mt-[18px] mt-4">
        <div class="text-lg font-medium mb-3 flex items-center">
          <Tags class="mr-3" />
          <span class=""> Thẻ nổi bật </span>
        </div>
        <div class="flex flex-wrap gap-2">
          <div v-for="item in tags" :key="item.id">
            <button
              @click="navigateTo(`/tin-tuc/tag/${item.slug}`)"
              class="px-3 py-2 bg-[#DBEFDE] text-secondary rounded-full flex"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>
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
