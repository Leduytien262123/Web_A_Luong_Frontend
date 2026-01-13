<script setup>
const { restAPI } = useApi();

const props = defineProps({
  categories: {
    type: Array,
    default: [],
  },
});

const searchQuery = ref(null);
const searchResults = ref([]);
const resultSearch = ref([]);
let searchTimeout = null;
const searchInput = ref(null);

const callApiSearch = async () => {
  // Gọi API để lấy dữ liệu
  if (resultSearch.value.length === 0) {
    const { data: resData } = await restAPI.stores.getSearch();
    resultSearch.value = resData.value.data || [];
  }
};

const handleSearch = () => {
  const searchQueryTrimmed = searchQuery.value.trim().toLowerCase();
  if (searchQueryTrimmed === "") {
    return [];
  }
  const filteredResults = resultSearch.value.filter((item) => {
    const scopeNormalized = item.scope
      .toLowerCase()
      .replace(/\s+/g, "") // Loại bỏ khoảng trắng
      .split(",") // Tách các phần tử cách nhau bằng dấu phẩy
      .join(""); // Nối lại thành một chuỗi liên tục
    return (
      item.name.toLowerCase().includes(searchQueryTrimmed) ||
      scopeNormalized.includes(searchQueryTrimmed)
    );
  });

  return filteredResults;
};

const onInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const filteredResults = handleSearch();
    searchResults.value = filteredResults;
  });
};

const onInputMb = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const filteredResults = handleSearch();
    searchResults.value = filteredResults;
  });
};

const searchResultsContainer = ref(null);

const handleClickOutside = (event) => {
  if (
    searchResultsContainer.value &&
    !searchResultsContainer.value.contains(event.target)
  ) {
    searchResults.value = [];
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const route = useRoute();
const router = useRouter();
const showDrawer = ref(false);
const showBaseSearch = ref(false);

const routeSlug = route.path.split("/").pop();

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

const onCloseSearch = () => {
  showBaseSearch.value = false;
  searchQuery.value = null;
  searchResults.value = [];
};

watch(
  () => showBaseSearch.value,
  (newValue) => {
    if (newValue === false) {
      searchQuery.value = null;
      searchResults.value = [];
    }
  }
);

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
// ---------------------------------------------------------------------------------------------------------------------
const toggleSearch = () => {
  callApiSearch();
  if (route.path === "/") {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition >= 500) {
      showBaseSearch.value = !showBaseSearch.value;
    } else {
      window.scrollTo({ top: 500, behavior: "smooth" });
    }
  } else {
    showBaseSearch.value = true;
  }
};

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

const menuItems = ref([
  { name: "Tin tức", slug: "tin-tuc" },
  // { name: "Dịch vụ khác", slug: "https://wifi247.vn/" },
]);

const formatPrice = (price) => {
  return price ? new Intl.NumberFormat("vi-VN").format(price) + "đ" : "";
};

watch(route, () => {
  showDrawer.value = false;
});

watch(showBaseSearch, async (newVal) => {
  if (newVal) {
    await nextTick();
    searchInput.value?.focus();
  }
});

function handleClick(menuSlug, optionSlug, childSlug) {
  toggleMenu();
  navigateTo(`/${menuSlug}/${optionSlug}/${childSlug}`);
}
</script>

<template>
  <div class="">
    <div class="relative">
      <div class="sticky top-0 z-[45] w-full">
        <div class="w-full lg:w-auto py-2 gap-4 bg-primary text-center z-60">
          <h1
            class="text-white text-base font-light"
            v-if="['/'].includes(route.path)"
          >
            Sim247 - Sim du lịch quốc tế
          </h1>
          <p class="text-white text-base font-light" v-else>
            Sim247 - Sim du lịch quốc tế
          </p>
        </div>
        <div
          class="flex w-full items-center justify-between bg-white py-5 width-base lg:py-4 space-x-0"
        >
          <div
            @click="toggleMenu"
            v-if="!showDrawer"
            class="lg:hidden w-6 h-6 mr-[5.5px]"
          >
            <MenuMobile />
          </div>
          <div class="w-[125px] h-10 gap-2">
            <NuxtLink to="/">
              <NuxtImg
                src="/img/logo.png"
                alt="logo"
                class="w-full h-full object-cover"
              />
            </NuxtLink>
          </div>

          <div class="hidden lg:flex items-center justify-center text-sm">
            <div class="py-4 flex text-sm">
              <NuxtLink to="/" class="text-secondary mr-2">
                <span
                  :class="{ 'text-primary': route.path === '/' }"
                  class="hover:text-[#39B54A]"
                  >Trang chủ</span
                >
              </NuxtLink>
              <div
                v-for="(menuItem, index) in visibleCategories"
                :key="index"
                class="relative group flex items-center"
              >
                <div class="xl:mx-2 lg:mx-2">
                  <NuxtLink :to="`/${menuItem.slug}`" class="relative block">
                    <div
                      class="flex items-center justify-center text-sm hover:text-[#39B54A]"
                    >
                      <div
                        :class="{
                          'text-primary': routeSlug === `${menuItem.slug}`,
                        }"
                        class="text-secondary"
                      >
                        {{ menuItem.name }}
                      </div>
                      <div
                        v-if="
                          menuItem?.options && menuItem?.options?.length > 0
                        "
                        class=""
                      >
                        <DropDownMenu />
                      </div>
                    </div>
                    <div
                      class="absolute top-full left-0 right-0 bg-transparent h-12"
                    ></div>
                  </NuxtLink>
                </div>
                <div
                  v-if="menuItem?.options"
                  class="hidden group-hover:block absolute top-16 z-20 bg-white rounded-xl"
                  id="dropdownMenu"
                >
                  <div
                    class=""
                    v-for="option in menuItem?.options"
                    :key="option"
                  >
                    <div
                      class="w-full dropdown p-1 text-base text-secondary whitespace-nowrap flex items-center justify-between"
                    >
                      <div
                        class="flex items-center justify-between cursor-pointer hover:bg-[#DBEFDE] rounded-xl"
                        @click="navigateTo(`/${menuItem.slug}/${option.slug}`)"
                      >
                        <div
                          class="text-secondary p-2 pr-8 w-full hover:text-[#39B54A]"
                        >
                          {{ option.name }}
                        </div>
                        <div
                          class="hover:bg-[#DBEFDE]"
                          v-if="option?.options && option?.options?.length > 0"
                        >
                          <DropRightMenu />
                        </div>
                      </div>

                      <div class="hidden 2xl:block">
                        <div
                          v-if="option?.options"
                          class="dropdown-content top-0 left-full ml-[1px] rounded-xl"
                          id="dropdownMenuChild"
                        >
                          <div
                            class="p-1 w-full"
                            v-for="child in option?.options"
                            :key="child"
                          >
                            <div
                              @click="
                                navigateTo(
                                  `/${menuItem?.slug}/${option?.slug}/${child?.slug}`
                                )
                              "
                              class="p-2 text-base text-secondary hover:bg-[#DBEFDE] hover:text-[#39B54A] whitespace-nowrap rounded-xl pr-8 cursor-pointer"
                            >
                              {{ child.name }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="2xl:hidden">
                        <div
                          v-if="option?.options"
                          class="dropdown-content top-0 right-full mr-[1px] rounded-xl"
                          id="dropdownMenuChild"
                        >
                          <div
                            class="p-1 w-full"
                            v-for="child in option?.options"
                            :key="child"
                          >
                            <div
                              @click="
                                navigateTo(
                                  `/${menuItem?.slug}/${option?.slug}/${child?.slug}`
                                )
                              "
                              class="p-2 text-base text-secondary hover:bg-[#DBEFDE] hover:text-[#39B54A] whitespace-nowrap rounded-xl pr-8 cursor-pointer"
                            >
                              {{ child.name }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-for="(item, index) in menuItems"
              :key="index"
              class="flex items-center justify-center"
            >
              <div
                @click="navigateTo(`/${item.slug}`)"
                class="mx-2 text-secondary hover:text-[#39B54A] cursor-pointer"
                :class="{
                  'text-primary': routeSlug === `${item.slug}`,
                }"
              >
                {{ item.name }}
              </div>
            </div>

            <div
              class="mx-2 text-secondary hover:text-[#39B54A] cursor-pointer"
            >
              <a href="https://wifi247.vn" class="" target="_blank">
                Dịch vụ khác</a
              >
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center justify-between">
                <div @click="toggleSearch" class="">
                  <SearchHeader class="cursor-pointer mb-1 ml-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Drawer
      v-model:show="showDrawer"
      placement="left"
      :classList="'w-75% px-18px'"
    >
      <div class="px-4 mb-[350px]">
        <div class="w-full flex items-center py-2 mb-2 mt-2">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            class="py-[18px] pl-4 pr-1 w-full h-[36px] text-secondary text-base border border-[#39b54a] focus:outline-none rounded-xl"
            v-model="searchQuery"
            @input="onInputMb"
          />
          <button
            aria-label="search"
            class="min-w-[36px] min-h-[36px] ml-2 right-0 bg-primary rounded-full flex items-center justify-center"
            @click="resultSearch"
          >
            <Search />
          </button>
        </div>

        <div
          v-if="searchResults?.length > 0"
          ref="searchResultsContainer"
          class="bg-white absolute z-[200] md:w-[90%] sm:w-[85%] w-[82%] rounded-2xl p-[15px] space-y-2 text-secondary border border-gray-200"
        >
          <div class="space-y-2">
            <div
              v-for="(result, index) in searchResults"
              :key="index"
              class="cursor-pointer"
            >
              <div @click="navigateTo(`/search/${result?.slug}`)" class="">
                {{ result.name }}
              </div>
            </div>
          </div>
        </div>

        <NuxtLink to="/" class="text-secondary mr-2">
          <span :class="{ 'text-primary': route.path === '/' }" class=""
            >Trang chủ</span
          >
        </NuxtLink>
        <Divider class="my-[13px]"></Divider>
        <div v-for="menuItem in visibleCategories" :key="menuItem.id">
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
          >
            <div @click="toggleMenu">
              <NuxtLink :to="`/${menuItem.slug}`">
                {{ menuItem.name }}
              </NuxtLink>
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
                <NuxtLink
                  :to="`/${menuItem.slug}/${option.slug}`"
                  @click="toggleMenu"
                >
                  <div
                    :class="{
                      'flex items-center justify-start text-primary':
                        isChildExpanded[option.id],
                      'flex items-center justify-start text-secondary':
                        !isChildExpanded[option.id],
                    }"
                    @click="toggleChildCollapse(option.id)"
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
              >
                <div @click="toggleMenu">
                  <NuxtLink :to="`/${menuItem.slug}/${option.slug}`">
                    {{ option.name }}
                  </NuxtLink>
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
                    @click="handleClick(menuItem.slug, option.slug, child.slug)"
                    class="text-secondary"
                  >
                    {{ child.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider class="my-[13px]"></Divider>
        </div>

        <div v-for="(item, index) in menuItems" :key="index">
          <NuxtLink :to="`/${item.slug}`" @click="toggleMenu">
            <div class="transition-all duration-300 text-title">
              {{ item.name }}
            </div>
          </NuxtLink>
          <Divider class="my-[13px]"></Divider>
        </div>

        <div class="text-secondary hover:text-[#39B54A] cursor-pointer">
          <a href="https://wifi247.vn" class="" target="_blank">
            Dịch vụ khác</a
          >
        </div>
      </div>
    </Drawer>

    <BaseSearch
      v-model:show="showBaseSearch"
      :searchResults="searchResults"
      :searchQuery="searchQuery"
      @close="onCloseSearch"
    >
      <div
        class="flex bg-white w-[705px] h-[86px] rounded-2xl absolute left-1/2 transform -translate-x-1/2 items-center justify-between px-[15px]"
      >
        <div class="w-full mr-4">
          <span class="text-title ml-2">Địa điểm</span>
          <input
            ref="searchInput"
            type="text"
            class="rounded-md text-sm w-full px-2 py-1 text-title focus:outline-none"
            placeholder="Nhập quốc gia du lịch..."
            v-model="searchQuery"
            @input="onInput"
          />
        </div>
        <ButtonBase
          class="min-w-14 min-h-14 rounded-lg flex justify-center items-center"
          @click="handleSearch"
        >
          <Search />
        </ButtonBase>
      </div>
    </BaseSearch>
  </div>
</template>

<style>
.orange-shadow {
  box-shadow: 0px 5px 10px 0px #96360233;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 20;
}

.dropdown-content a {
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
