<script setup>
// const { restAPI } = useApi();

const searchQuery = ref(null);
const searchResults = ref([]);
const resultSearch = ref([]);
let searchTimeout = null;
const searchInput = ref(null);

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
const showDrawer = ref(false);
const showBaseSearch = ref(false);

const routeSlug = route.path.split("/").pop();

const selectedOption = ref(-1);
const selectedOptionChild = ref(-1);
const visibleCategories = ref([]);
const isExpanded = ref(Array(visibleCategories.value.length).fill(false));
const isChildExpanded = ref(
  visibleCategories.value.map((category) => category.options.map(() => false))
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
  // { name: "Tin tức", slug: "tin-tuc" },
  // { name: "Dịch vụ khác", slug: "https://wifi247.vn/" },
]);

watch(route, () => {
  showDrawer.value = false;
});

watch(showBaseSearch, async (newVal) => {
  if (newVal) {
    await nextTick();
    searchInput.value?.focus();
  }
});

const toggleMenu = () => {
  showDrawer.value = !showDrawer.value;
};

function handleClick(menuSlug, optionSlug, childSlug) {
  toggleMenu();
  navigateTo(`/${menuSlug}/${optionSlug}/${childSlug}`);
}
</script>

<template>
  <div class="">
    <div class="relative">
      <div class="sticky top-0 z-[45] w-full">
        <div class="w-full lg:w-auto gap-4 bg-primary text-center z-60">
          <h1
            v-if="['/'].includes(route.path)"
            class="text-white py-3"
            style="font-size: 18px !important; font-weight: 400"
          >
            Quản Trị Rủi Ro Dự Án Đầu Tư Xây Dựng
          </h1>
          <p v-else class="text-white text-base">
            Quản Trị Rủi Ro Dự Án Đầu Tư Xây Dựng
          </p>
        </div>
        <div
          class="flex w-full items-center justify-between bg-white py-5 width-base lg:py-4 space-x-0"
        >
          <div
            v-if="!showDrawer"
            class="lg:hidden w-6 h-6 mr-[5.5px]"
            @click="toggleMenu"
          >
            <MenuMobile />
          </div>
          <div class="w-[155px] h-14 gap-2">
            <NuxtLink to="/">
              <NuxtImg
                src="/img/logo.png"
                alt="logo"
                class="w-full h-full object-cover"
              />
            </NuxtLink>
          </div>

          <div class="hidden lg:flex items-center justify-center text-sm">
            <div class="py-4 flex text-base">
              <NuxtLink to="/" class="text-secondary mr-2">
                <span
                  :class="{ 'text-primary': route.path === '/' }"
                  class="hover:text-[#b68258]"
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
                      class="flex items-center justify-center text-sm hover:text-[#b68258]"
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
                    />
                  </NuxtLink>
                </div>
                <div
                  v-if="menuItem?.options"
                  id="dropdownMenu"
                  class="hidden group-hover:block absolute top-16 z-20 bg-white rounded-xl"
                >
                  <div v-for="option in menuItem?.options" :key="option">
                    <div
                      class="w-full dropdown p-1 text-base text-secondary whitespace-nowrap flex items-center justify-between"
                    >
                      <div
                        class="flex items-center justify-between cursor-pointer hover:bg-[#DBEFDE] rounded-xl"
                        @click="navigateTo(`/${menuItem.slug}/${option.slug}`)"
                      >
                        <div
                          class="text-secondary p-2 pr-8 w-full hover:text-[#b68258]"
                        >
                          {{ option.name }}
                        </div>
                        <div
                          v-if="option?.options && option?.options?.length > 0"
                          class="hover:bg-[#DBEFDE]"
                        >
                          <DropRightMenu />
                        </div>
                      </div>

                      <div class="hidden 2xl:block">
                        <div
                          v-if="option?.options"
                          id="dropdownMenuChild"
                          class="dropdown-content top-0 left-full ml-[1px] rounded-xl"
                        >
                          <div
                            v-for="child in option?.options"
                            :key="child"
                            class="p-1 w-full"
                          >
                            <div
                              class="p-2 text-base text-secondary hover:bg-[#DBEFDE] hover:text-[#b68258] whitespace-nowrap rounded-xl pr-8 cursor-pointer"
                              @click="
                                navigateTo(
                                  `/${menuItem?.slug}/${option?.slug}/${child?.slug}`
                                )
                              "
                            >
                              {{ child.name }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="2xl:hidden">
                        <div
                          v-if="option?.options"
                          id="dropdownMenuChild"
                          class="dropdown-content top-0 right-full mr-[1px] rounded-xl"
                        >
                          <div
                            v-for="child in option?.options"
                            :key="child"
                            class="p-1 w-full"
                          >
                            <div
                              class="p-2 text-base text-secondary hover:bg-[#DBEFDE] hover:text-[#b68258] whitespace-nowrap rounded-xl pr-8 cursor-pointer"
                              @click="
                                navigateTo(
                                  `/${menuItem?.slug}/${option?.slug}/${child?.slug}`
                                )
                              "
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
                class="mx-2 text-secondary hover:text-[#b68258] cursor-pointer"
                :class="{
                  'text-primary': routeSlug === `${item.slug}`,
                }"
                @click="navigateTo(`/${item.slug}`)"
              >
                {{ item.name }}
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center justify-between">
                <div @click="toggleSearch">
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
      :class-list="['w-[75%]', 'px-[18px]']"
    >
      <div class="px-4 mb-[350px]">
        <div class="w-full flex items-center py-2 mb-2 mt-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            class="py-[18px] pl-4 pr-1 w-full h-[36px] text-secondary text-base border border-[#b68258] focus:outline-none rounded-xl"
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
              <div @click="navigateTo(`/search/${result?.slug}`)">
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
        <Divider class="my-[13px]" />
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
                v-if="menuItem?.options && menuItem?.options?.length > 0"
                class="ml-auto"
                @click="toggleCollapse(menuItem.id)"
              >
                <div>
                  <img
                    :src="
                      isExpanded[menuItem.id]
                        ? '/svg/arrow-down.svg'
                        : '/svg/arrow-right.svg'
                    "
                    alt="icon"
                    @click="toggleCollapse(menuItem.id)"
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
                    v-if="option?.options && option?.options?.length > 0"
                    class="ml-auto"
                    @click="toggleChildCollapse(option.id)"
                  >
                    <div>
                      <img
                        :src="
                          isChildExpanded[option.id]
                            ? '/svg/arrow-down.svg'
                            : '/svg/arrow-right.svg'
                        "
                        alt="icon"
                        @click="toggleChildCollapse(option.id)"
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
                    class="text-secondary"
                    @click="handleClick(menuItem.slug, option.slug, child.slug)"
                  >
                    {{ child.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider class="my-[13px]" />
        </div>

        <div v-for="(item, index) in menuItems" :key="index">
          <NuxtLink :to="`/${item.slug}`" @click="toggleMenu">
            <div class="transition-all duration-300 text-title">
              {{ item.name }}
            </div>
          </NuxtLink>
          <Divider class="my-[13px]" />
        </div>

        <div class="text-secondary hover:text-[#b68258] cursor-pointer">
          <a href="https://wifi247.vn" class="" target="_blank">
            Dịch vụ khác</a
          >
        </div>
      </div>
    </Drawer>
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
