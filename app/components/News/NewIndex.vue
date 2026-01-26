<script setup>
const unit = ref("bài viết");

const { restAPI } = useApi();

const news = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = ref(12);
const pageSizeMd = ref(9);
const pageSizeSm = ref(6);
const pageSizeMb = ref(4);
const screenBreakpoint = ref("xl");

const updateScreenBreakpoint = () => {
  const width = window.innerWidth;
  if (width >= 1280) {
    screenBreakpoint.value = "xl";
    pageSize.value = 12;
  } else if (width >= 1024) {
    screenBreakpoint.value = "lg";
    pageSize.value = 12;
  } else if (width >= 768) {
    screenBreakpoint.value = "md";
    pageSize.value = pageSizeMd.value;
  } else if (width >= 640) {
    screenBreakpoint.value = "sm";
    pageSize.value = pageSizeSm.value;
  } else {
    screenBreakpoint.value = "mb";
    pageSize.value = pageSizeMb.value;
  }

  currentPage.value = 1;
};

const fetchData = async () => {
  try {
    const { data: resData } = await restAPI.stores.getBlogs({
      params: {
        current: currentPage.value,
        pageSize: pageSize.value,
      },
    });
    news.value = resData?.value?.data || [];
    totalItems.value = resData?.value?.total || 0;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API:", error);
  }
};

watch(pageSize, async () => {
  await fetchData();
});

await fetchData();

onMounted(async () => {
  updateScreenBreakpoint();
  await fetchData();
  window.addEventListener("resize", updateScreenBreakpoint);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenBreakpoint);
});

const setTotalPage = computed(() =>
  Math.ceil(totalItems.value / pageSize.value),
);

const displayedNews = computed(() => {
  // const startIndex = (currentPage.value - 1) * pageSize.value;
  // const endIndex = startIndex + pageSize.value;
  return news.value;
});

const handleChangePage = async (pageNumber) => {
  if (pageNumber < 1 || pageNumber > setTotalPage.value) return;
  currentPage.value = pageNumber;
  await fetchData();
};

const handleChangePageSize = async (pageSizeNumber) => {
  pageSize.value = pageSizeNumber;
  currentPage.value = 1;
  await fetchData();
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
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:gap-[30px] gap-x-4 gap-y-6"
    >
      <div v-for="item in displayedNews" :key="item.id" class="">
        <div
          class="cursor-pointer"
          @click="navigateTo(`/tin-tuc/${item.slug}`)"
        >
          <div class="relative rounded-xl">
            <img
              :src="item.feature_image?.[0]?.src || '/img/empty.jpg'"
              :alt="item.feature_image?.[0]?.alt || 'No-image'"
              class="w-full aspect-[1.5] rounded-xl object-cover"
            />
            <div
              v-if="item?.published_at"
              class="absolute bg-white px-2 py-[7px] text-secondady font-light rounded-lg left-3 bottom-2.5"
            >
              {{ formatDate(item?.published_at) }}
            </div>
          </div>
          <div class="rounded-xl bg-[#DBEFDE] p-3 mt-3 min-h-[176px]">
            <div class="text-primary line-clamp-2">{{ item.name }}</div>
            <div
              class="text-secondary mt-2 line-clamp-4 description-blog"
              v-html="item?.description"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <Pagination
      class="mt-10 hidden lg:block"
      :totalPages="setTotalPage"
      :currentPage="currentPage"
      @on-change-page="handleChangePage"
      @on-change-page-size="handleChangePageSize"
      :pageSizeOptions="[12, 24, 36]"
      :defaultPageSize="pageSize"
      :total="totalItems"
      :unit="unit"
    />
    <Pagination
      class="mt-10 hidden md:block lg:hidden"
      :totalPages="setTotalPage"
      :currentPage="currentPage"
      @on-change-page="handleChangePage"
      @on-change-page-size="handleChangePageSize"
      :pageSizeOptions="[9, 15, 24]"
      :defaultPageSize="pageSizeMd"
      :total="totalItems"
      :unit="unit"
    />
    <Pagination
      :total="totalItems"
      :unit="unit"
      :totalPages="setTotalPage"
      :currentPage="currentPage"
      :pageSizeOptions="[6, 10, 16]"
      :defaultPageSize="pageSizeSm"
      class="mt-10 hidden sm:block md:hidden"
      @on-change-page="handleChangePage"
      @on-change-page-size="handleChangePageSize"
    />
    <Pagination
      class="mt-10 sm:hidden"
      :totalPages="setTotalPage"
      :currentPage="currentPage"
      @on-change-page="handleChangePage"
      @on-change-page-size="handleChangePageSize"
      :pageSizeOptions="[4, 8, 12]"
      :defaultPageSize="pageSizeMb"
      :total="totalItems"
      :unit="unit"
    />
  </div>
</template>
