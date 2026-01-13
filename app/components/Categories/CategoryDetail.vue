<script setup>
import { useProductStore } from "~/stores/product";

const productStore = useProductStore();
const gtm = useGtm();
const route = useRoute();
const unit = ref("sản phẩm");
const { restAPI } = useApi();
const path = (route.path.split("/").filter(Boolean).pop() || "").toString();
const props = defineProps({
  categories: {
    type: Array,
    default: [],
  },
});

const currentPage = ref(1);
const pageSize = ref(6);
const categoriesDetail = ref({});
const sort_by = ref("created_at");
const sort_order = ref("desc");

const handleSortChange = async (event) => {
  const selectedValue = event.target.value;
  sort_order.value = selectedValue === "asc" ? "asc" : "desc";
  await fetchData();
};

const fetchData = async () => {
  const { data: resDataDetail } =
    await restAPI.stores.getStoreProductCategoriesDetail(path, {
      params: {
        current: currentPage.value,
        pageSize: pageSize.value,
        sort_by: sort_by.value,
        sort_order: sort_order.value,
      },
    });
  categoriesDetail.value = resDataDetail.value?.data;
};
await fetchData();

const categories = props?.categories || [];

const isObjectNullOrEmpty = (value) =>
  value === null || value === undefined || value === "";

const rawCategories = [...props.categories];

const categoriesMap = rawCategories.reduce((acc, item) => {
  acc[item.id] = { ...item, options: [] };
  return acc;
}, {});

Object.values(categoriesMap).forEach((category) => {
  if (
    !isObjectNullOrEmpty(category.parent_id) &&
    categoriesMap[category.parent_id]
  ) {
    categoriesMap[category.parent_id].options.push(category);
  }
});

let visibleCategories = Object.values(categoriesMap).filter(
  (category) =>
    isObjectNullOrEmpty(category.parent_id) && category.visible_nav === 1
);

visibleCategories.forEach((category) => {
  category.options = category.options.filter(
    (child) => child.visible_nav === 1
  );
  category.options.forEach((child) => {
    child.options = Object.values(categoriesMap).filter(
      (subCategory) =>
        subCategory.parent_id === child.id && subCategory.visible_nav === 1
    );
    child.options.sort((c1, c2) => c1.position - c2.position);
  });
  category.options.sort((c1, c2) => c1.position - c2.position);
});

visibleCategories.sort((c1, c2) => c1.position - c2.position);

const selectedOption = ref(-1);
const selectedOptionChild = ref(-1);
const isExpanded = ref(Array(visibleCategories.length).fill(false));
const isChildExpanded = ref(
  visibleCategories.map((category) => category.options.map(() => false))
);

const toggleCollapse = (index) => {
  isExpanded.value[index] = !isExpanded.value[index];
  if (selectedOption.value === index) {
    selectedOption.value = -1;
  } else {
    selectedOption.value = index;
  }
};

const toggleChildCollapse = (index) => {
  isChildExpanded.value[index] = !isChildExpanded.value[index];
  if (selectedOptionChild.value === index) {
    selectedOptionChild.value = -1;
  } else {
    selectedOptionChild.value = index;
  }
};

const newsCategoryDetail = categoriesDetail.value || null;

const formatPrice = (price) => {
  return price ? new Intl.NumberFormat("vi-VN").format(price) + "đ" : "";
};

const totalItems = ref(categoriesDetail.value?.total_products);

const setTotalPage = computed(() =>
  Math.ceil(totalItems.value / pageSize.value)
);

const displayedProducts = computed(() => {
  // const startIndex = (currentPage.value - 1) * pageSize.value;
  // const endIndex = startIndex + pageSize.value;
  // return categoriesDetail.value?.products?.slice(startIndex, endIndex);
  return categoriesDetail.value?.products || [];
});

const handleChangePage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > setTotalPage.value) return;
  currentPage.value = pageNumber;
  fetchData();
};

const handleChangePageSize = (pageSizeNumber) => {
  pageSize.value = pageSizeNumber;
  currentPage.value = 1;
  fetchData();
};

const linksBreadcrumb = ref([]);

const buildBreadcrumbs = () => {
  const categoryPathArr = route.path.split("/").filter(Boolean);
  let path = "";
  for (let i = 0; i < categoryPathArr?.length; i++) {
    path += `/${categoryPathArr[i]}`;
    const category = categories.find((cat) => cat.slug === categoryPathArr[i]);
    linksBreadcrumb.value.push({
      label: category ? category.name : "Sản phẩm",
      to: path,
      disabled: i === categoryPathArr?.length - 1,
    });
  }
};
buildBreadcrumbs();

function getCheapestProduct(variants) {
  if (!variants || !variants?.length) return null;
  return variants.reduce((cheapest, current) => {
    const currentPrice = current.price_sale || current.price || Infinity;
    const cheapestPrice = cheapest.price_sale || cheapest.price || Infinity;
    return currentPrice < cheapestPrice ? current : cheapest;
  }, {});
}

const handleProductClick = (product) => {
  productStore.addProductToSeen(product);
  gtm?.dataLayer()?.push({ ecommerce: null });
  gtm?.dataLayer()?.push({
    event: "select_item",
    ecommerce: {
      item_list_id: product?.id || "",
      item_list_name: product?.name || "",
      items: [product],
    },
  });
  navigateTo(`/sanpham/${product.slug}`);
};

const validateRoutePath = () => {
  const categoryPathArr = route.path.split("/").filter(Boolean);
  const allowedPaths = [
    "tin-tuc",
    "search",
    "sanpham",
    "dat-hang",
    "chinh-sach-thanh-toan",
    "chinh-sach-doi-tra",
    "huong-dan-mua-hang",
    "kiem-tra-thiet-bi",
  ];
  if (allowedPaths.includes(categoryPathArr[0])) {
    return;
  }
  let currentCategories = visibleCategories;
  for (let i = 0; i < categoryPathArr.length; i++) {
    const category = currentCategories.find(
      (cat) => cat.slug === categoryPathArr[i]
    );
    if (!category) {
      navigateTo("/");
      return;
    }
    currentCategories = category.options;
  }
};

validateRoutePath();
</script>

<template>
  <div class="">
    <div class="lg:flex items-center justify-between">
      <Breadcrumb :links="linksBreadcrumb" class="text-center" />
      <div
        class="text-secondary flex justify-between items-center mt-3 lg:mt-0"
      >
        <span class="mr-2"> Hiển thị tất cả {{ totalItems }} kết quả </span>
        <select
          class="bg-[#F2F2F2] p-3 rounded-lg border border-none focus:outline-none focus:border-[#DBEFDE] pr-10"
          @change="handleSortChange"
        >
          <option value="desc" class="py-2">Lọc theo mới nhất</option>
          <option value="asc" class="py-2">Lọc theo cũ nhất</option>
        </select>
      </div>
    </div>
    <div class="flex justify-between lg:mt-[30px] mt-[45px]">
      <div class="lg:w-[75%] xl:mr-[30px] lg:mr-5">
        <div
          v-if="totalItems > 0"
          class="grid sm:grid-cols-3 grid-cols-2 xl:gap-[30px] lg:gap-6 md:gap-6 gap-4"
        >
          <div v-for="item in displayedProducts" :key="item.name" class="">
            <div @click="handleProductClick(item)" class="cursor-pointer">
              <div
                class="max-w-[310px] 2xl:max-w-full 2xl:max-h-full max-h-[310px] relative"
              >
                <img
                  :src="item.thumb_image?.[0]?.src || '/img/empty.jpg'"
                  :alt="item.thumb_image?.[0]?.alt || 'No-image'"
                  class="w-full h-full object-cover rounded-tl-3xl rounded-tr-3xl"
                />
                <div
                  v-if="item.type"
                  class="absolute top-3 left-3 bg-white px-2 py-1 rounded-lg text-sm font-light"
                >
                  {{ item.type }}
                </div>

                <div
                  v-if="
                    getCheapestProduct(item.variants)?.price_sale &&
                    getCheapestProduct(item.variants)?.price_sale <
                      getCheapestProduct(item.variants)?.price &&
                    Math.floor(
                      (getCheapestProduct(item.variants)?.price_sale /
                        getCheapestProduct(item.variants)?.price) *
                        100
                    ) > 2
                  "
                  class="absolute top-3 right-3 bg-[#FF6C1C] text-white px-2 py-1 rounded-lg text-sm font-light"
                >
                  Sale off
                  {{
                    100 -
                    Math.floor(
                      (getCheapestProduct(item.variants)?.price_sale /
                        getCheapestProduct(item.variants)?.price) *
                        100
                    )
                  }}%
                </div>
              </div>

              <div class="text-title text-base mt-3">
                {{ getCheapestProduct(item.variants)?.name }}
              </div>
              <div class="text-lg">
                <span
                  v-if="
                    getCheapestProduct(item.variants)?.price_sale &&
                    getCheapestProduct(item.variants)?.price_sale !== 0
                  "
                  class="text-[#B1B1B1] mb-1 mr-4 line-through"
                >
                  {{ formatPrice(getCheapestProduct(item.variants)?.price) }}
                </span>
                <span
                  v-if="
                    getCheapestProduct(item.variants)?.price_sale &&
                    getCheapestProduct(item.variants)?.price_sale !== 0
                  "
                  class="text-primary"
                >
                  {{
                    formatPrice(
                      getCheapestProduct(item.variants)?.price_sale
                    ) || formatPrice(getCheapestProduct(item.variants)?.price)
                  }}
                </span>

                <span v-else class="text-primary">
                  {{ formatPrice(getCheapestProduct(item.variants)?.price) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-secondary py-10">
          Danh mục chưa có sản phẩm.
        </div>
        <Pagination
          v-if="totalItems > 0"
          class="my-[60px]"
          :totalPages="setTotalPage"
          :currentPage="currentPage"
          @on-change-page="handleChangePage"
          @on-change-page-size="handleChangePageSize"
          :pageSizeOptions="[6, 9, 12]"
          :defaultPageSize="pageSize"
          :total="totalItems"
          :unit="unit"
        />
        <NewsCategoryDetail
          v-if="newsCategoryDetail"
          :newsCategoryDetail="newsCategoryDetail"
        />
      </div>
      <div class="hidden lg:block w-[25%]">
        <div class="px-[30px] py-[22px] bg-[#F2F2F2] rounded-lg">
          <div v-for="(menuItem, index) in visibleCategories" :key="index">
            <div v-if="menuItem.options.length === 0">
              <NuxtLink :to="`/${menuItem.slug}`">
                <div
                  :class="{
                    'flex items-center justify-start text-primary':
                      isExpanded[menuItem.id],
                    'flex items-center justify-start text-title':
                      !isExpanded[menuItem.id],
                  }"
                  @click="toggleCollapse(menuItem.id)"
                  class="hover:text-[#39b54a]"
                >
                  {{ menuItem.name }}
                </div>
              </NuxtLink>
            </div>

            <div
              v-else
              :class="{
                'flex items-center justify-start text-primary':
                  isExpanded[menuItem.id],
                'flex items-center justify-start text-title':
                  !isExpanded[menuItem.id],
              }"
              @click="toggleCollapse(menuItem.id)"
              class="cursor-pointer hover:text-[#39b54a]"
            >
              <div @click="navigateTo(`/${menuItem.slug}`)">
                {{ menuItem.name }}
              </div>
              <ClientOnly>
                <div
                  class="ml-auto"
                  v-if="menuItem?.options && menuItem?.options?.length > 0"
                  @click="toggleCollapse(menuItem.id)"
                >
                  <div>
                    <img
                      :src="
                        isExpanded[menuItem.id]
                          ? '/svg/arrow-down.svg'
                          : '/svg/arrow-right.svg'
                      "
                      @click="toggleCollapse(menuItem.id)"
                      alt="icon"
                    />
                  </div>
                </div>
              </ClientOnly>
            </div>

            <div
              class="overflow-hidden transition-all duration-[700]"
              :class="
                isExpanded[menuItem.id]
                  ? 'max-h-full opacity-100'
                  : 'max-h-0 opacity-0'
              "
            >
              <div
                v-for="option in menuItem?.options"
                :key="option.id"
                class="pt-[13px] pb-[5px] pl-[18px] text-sm"
              >
                <div v-if="option.options.length === 0">
                  <NuxtLink :to="`/${menuItem.slug}/${option.slug}`">
                    <div
                      :class="{
                        'flex items-center justify-start text-primary':
                          isChildExpanded[option.id],
                        'flex items-center justify-start text-secondary':
                          !isChildExpanded[option.id],
                      }"
                      @click="toggleChildCollapse(option.id)"
                      class="hover:text-[#39b54a]"
                    >
                      {{ option.name }}
                    </div>
                  </NuxtLink>
                </div>

                <div
                  v-else
                  :class="{
                    'flex items-center justify-start text-primary':
                      isChildExpanded[option.id],
                    'flex items-center justify-start text-title':
                      !isChildExpanded[option.id],
                  }"
                  @click="toggleChildCollapse(option.id)"
                  class="cursor-pointer hover:text-[#39b54a]"
                >
                  <div @click="navigateTo(`/${menuItem.slug}/${option.slug}`)">
                    {{ option?.name }}
                  </div>
                  <ClientOnly>
                    <div
                      class="ml-auto"
                      v-if="option?.options && option?.options?.length > 0"
                      @click="toggleChildCollapse(option.id)"
                    >
                      <div>
                        <img
                          :src="
                            isChildExpanded[option.id]
                              ? '/svg/arrow-down.svg'
                              : '/svg/arrow-right.svg'
                          "
                          @click="toggleChildCollapse(option.id)"
                          alt="icon"
                        />
                      </div>
                    </div>
                  </ClientOnly>
                </div>

                <div
                  class="overflow-hidden transition-all duration-[700]"
                  :class="{
                    'max-h-full opacity-100': isChildExpanded[option.id],
                    'max-h-0 opacity-0': !isChildExpanded[option.id],
                  }"
                >
                  <div
                    v-for="(child, indexChild) in option?.options"
                    :key="indexChild"
                    class="pt-[13px] pb-[5px] pl-[18px] text-sm"
                  >
                    <div
                      @click="
                        navigateTo(
                          `/${menuItem.slug}/${option.slug}/${child.slug}`
                        )
                      "
                      class="text-secondary hover:text-[#39b54a] cursor-pointer"
                    >
                      {{ child?.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Divider
              v-if="index !== visibleCategories.length - 1"
              class="my-[13px]"
            ></Divider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
