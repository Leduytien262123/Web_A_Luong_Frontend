<script setup>
import { SwiperSlide } from "swiper/vue";
const route = useRoute();
const checkMobile = ref(false);
if (route.name === "tin-tuc-slugDetailNew") {
  checkMobile.value = true;
}

const props = defineProps({
  categoriesRaw: { type: Array, default: () => [] },
  articlesFeatured: { type: [Array, Object], default: () => [] },
  tags: { type: Array, default: () => [] },
});

const categories = computed(() => {
  return (props.categoriesRaw ?? []).slice().sort((a, b) => {
    const pa = a?.position_menu ?? a?.display_order ?? 0;
    const pb = b?.position_menu ?? b?.display_order ?? 0;
    if (pa !== pb) return pa - pb;
    return (a?.name || "").localeCompare(b?.name || "");
  });
});

const articlesFeatured = computed(() => {
  const featured = props.articlesFeatured;
  if (Array.isArray(featured)) return featured;
  if (Array.isArray(featured?.data?.articles)) return featured.data.articles;
  if (Array.isArray(featured?.data)) return featured.data;
  if (Array.isArray(featured?.articles)) return featured.articles;
  return [];
});
const tags = computed(() => props.tags ?? []);

const news = [];

const expanded = reactive({});
const expandedChild = reactive({});

const toggleCollapse = (id) => {
  expanded[id] = !expanded[id];
};

const toggleChildCollapse = (id) => {
  expandedChild[id] = !expandedChild[id];
};

const router = useRouter();
const navigateTo = (path) => {
  if (!path) return;
  router.push(path);
};

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
        <div class="text-lg font-medium mb-2">Danh mục</div>

        <!-- <div class="bg-[#F2F2F2] p-5 rounded-2xl shadow-sm"> -->
        <div
          v-for="(menuItem, index) in categories"
          :key="menuItem.id || index"
          class="py-1"
        >
          <div
            class="flex items-center justify-between px-3 py-1 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
            @click="
              menuItem.children?.length
                ? toggleCollapse(menuItem.id)
                : navigateTo(`/${menuItem.slug}`)
            "
          >
            <span
              class="text-title font-medium"
              @click="navigateTo(`/${menuItem.slug}`)"
              >{{ menuItem.name }}</span
            >
            <span
              v-if="menuItem.children?.length"
              class="ml-3 text-sm text-secondary transition-transform duration-200 inline-flex"
              :class="{ 'rotate-90': expanded[menuItem.id] }"
            >
              <i class="icon icon-arrow" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 5l8 7-8 7"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </i>
            </span>
          </div>

          <transition
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-250 ease-in"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-[800px] opacity-100"
            leave-from-class="max-h-[800px] opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-if="expanded[menuItem.id]" class="pl-4 mt-1 relative">
              <div
                class="absolute left-3 top-0 bottom-0 w-[1px] bg-black/30"
              ></div>

              <div class="space-y-2">
                <div
                  v-for="option in menuItem.children"
                  :key="option.id"
                  class="relative ml-3 rounded-lg px-3 py-1 mt-1 hover:bg-white/80 transition-colors cursor-pointer"
                >
                  <div
                    class="flex items-center justify-between cursor-pointer hover:text-primary"
                    @click="
                      option.children?.length
                        ? toggleChildCollapse(option.id)
                        : navigateTo(`/${menuItem.slug}/${option.slug}`)
                    "
                  >
                    <span
                      class="text-title font-medium break-all"
                      @click="navigateTo(`/${menuItem.slug}/${option.slug}`)"
                      >{{ option.name }}</span
                    >
                    <span
                      v-if="option.children?.length"
                      class="ml-2 text-sm text-secondary transition-transform duration-200 inline-flex"
                      :class="{ 'rotate-90': expandedChild[option.id] }"
                    >
                      <i class="icon icon-arrow" aria-hidden="true">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 5l8 7-8 7"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </i>
                    </span>
                  </div>

                  <transition
                    enter-active-class="transition-all duration-250 ease-out"
                    leave-active-class="transition-all duration-200 ease-in"
                    enter-from-class="max-h-0 opacity-0"
                    enter-to-class="max-h-[600px] opacity-100"
                    leave-from-class="max-h-[600px] opacity-100"
                    leave-to-class="max-h-0 opacity-0"
                  >
                    <div
                      v-if="expandedChild[option.id]"
                      class="mt-2 pl-3 space-y-2"
                    >
                      <div
                        v-for="child in option.children"
                        :key="child.id"
                        class="text-sm text-title font-medium hover:text-primary cursor-pointer"
                        @click="
                          navigateTo(
                            `/${menuItem.slug}/${option.slug}/${child.slug}`,
                          )
                        "
                      >
                        {{ child.name }}
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <!-- </div> -->
      </div>
      <div class="mt-[26px] hidden lg:block">
        <div class="text-lg font-medium">Bài viết nổi bật</div>
        <div
          v-for="item in articlesFeatured.slice(0, 5)"
          :key="item.id"
          class="my-3 flex"
        >
          <img
            :src="item?.content?.cover_photo?.[0]?.url || '/img/empty.jpg'"
            :alt="item?.content?.cover_photo?.[0]?.alt || 'No image'"
            class="max-w-[60px] max-h-[60px] aspect-[1.0] mr-2 rounded-lg cursor-pointer object-cover"
            @click="navigateTo(`/articles/${item.slug}`)"
          />
          <div class="text-base">
            <div
              class="leading-[1.35] line-clamp-3 cursor-pointer"
              @click="navigateTo(`/articles/${item.slug}`)"
            >
              {{ item.title }}
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
                class="cursor-pointer"
                @click="navigateTo(`/tin-tuc/${item.slug}`)"
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
                <div class="rounded-xl bg-[#DBC0AB] p-3 mt-3 min-h-[192px]">
                  <div class="text-primary line-clamp-2">{{ item.name }}</div>
                  <div
                    class="text-secondary mt-2 line-clamp-4"
                    v-html="item.description"
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
              class="px-3 py-2 bg-[#DBC0AB] text-secondary rounded-full flex"
              @click="navigateTo(`/tin-tuc/tag/${item.slug}`)"
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
</style>
