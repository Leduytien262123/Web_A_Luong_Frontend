<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});

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

const router = useRouter();

const navigateTo = (path) => {
  if (!path) return;
  showDrawer.value = false;
  router.push(path);
};

const visibleCategories = computed(() => {
  if (!props?.categories) return [];

  const filterAndSort = (items) => {
    const list = Array.isArray(items) ? items.slice() : [];
    return list
      .filter((item) => item && item.show_menu === true)
      .map((item) => ({
        ...item,
        children: filterAndSort(item.children),
      }))
      .sort((a, b) => {
        const pa = a?.position_menu ?? a?.display_order ?? 0;
        const pb = b?.position_menu ?? b?.display_order ?? 0;
        if (pa !== pb) return pa - pb;
        return (a?.name || "").localeCompare(b?.name || "");
      });
  };

  return filterAndSort(props.categories);
});

const navigationItems = computed(() => {
  const transform = (items) => {
    return items.map((item) => {
      const currentPath = `/${item?.slug}`;
      const menu = {
        label: item.name,
        to: currentPath,
      };

      if (item.children && item.children.length > 0) {
        menu.children = transform(item.children, currentPath);
      }

      return menu;
    });
  };

  const items = transform(visibleCategories.value || []);
  items.unshift({ label: "Trang chủ", to: "/" });
  return items;
});

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
</script>

<template>
  <div class="bg-white">
    <div class="relative">
      <div class="sticky top-0 z-[9999] w-full">
        <div class="w-full lg:w-auto gap-4 bg-primary text-center z-[10000]">
          <h1
            v-if="['/'].includes(route.path)"
            class="text-white py-3"
            style="font-size: 18px !important; font-weight: 400"
          >
            Quản Trị Rủi Ro Dự Án Đầu Tư Xây Dựng
          </h1>
          <p v-else class="text-white text-base py-3">
            Quản Trị Rủi Ro Dự Án Đầu Tư Xây Dựng
          </p>
        </div>
        <div
          class="flex w-full items-center justify-between py-5 width-base lg:py-4 space-x-0"
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

          <div class="w-[29.5px] lg:hidden"></div>
          <div
            v-if="showDrawer"
            class="flex items-center justify-center ml-auto"
          >
            <div
              @click="
                () => {
                  showDrawer = false;
                }
              "
              class="mr-2"
            >
              <Close />
            </div>
          </div>

          <!-- <div class="hidden lg:flex items-center justify-center text-base">
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
                      class="flex items-center justify-center text-base hover:text-[#b68258]"
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
                          menuItem?.children && menuItem?.children?.length > 0
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
                  v-if="menuItem?.children"
                  id="dropdownMenu"
                  class="hidden group-hover:block absolute top-16 z-20 rounded-xl bg-white"
                >
                  <div v-for="option in menuItem?.children" :key="option">
                    <div
                      class="w-full dropdown p-1 text-base text-secondary whitespace-nowrap flex items-center justify-between"
                    >
                      <div
                        class="flex items-center justify-between cursor-pointer hover:bg-[#C69A7A] rounded-xl"
                        @click="navigateTo(`/${menuItem.slug}/${option.slug}`)"
                      >
                        <div
                          class="text-secondary p-2 pr-8 w-full hover:text-[#b68258]"
                        >
                          {{ option.name }}
                        </div>
                        <div
                          v-if="
                            option?.children && option?.children?.length > 0
                          "
                          class="hover:bg-[#C69A7A]"
                        >
                          <DropRightMenu />
                        </div>
                      </div>

                      <div class="hidden 2xl:block">
                        <div
                          v-if="option?.children"
                          id="dropdownMenuChild"
                          class="dropdown-content top-0 left-full ml-[1px] rounded-xl bg-white"
                        >
                          <div
                            v-for="child in option?.children"
                            :key="child"
                            class="p-1 w-full"
                          >
                            <div
                              class="p-2 text-base text-secondary hover:bg-[#C69A7A] hover:text-[#b68258] whitespace-nowrap rounded-xl pr-8 cursor-pointer"
                              @click="
                                navigateTo(
                                  `/${menuItem?.slug}/${option?.slug}/${child?.slug}`,
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
                          v-if="option?.children"
                          id="dropdownMenuChild"
                          class="dropdown-content top-0 right-full mr-[1px] rounded-xl"
                        >
                          <div
                            v-for="child in option?.children"
                            :key="child"
                            class="p-1 w-full"
                          >
                            <div
                              class="p-2 text-base text-secondary hover:bg-[#C69A7A] hover:text-[#b68258] whitespace-nowrap rounded-xl pr-8 cursor-pointer"
                              @click="
                                navigateTo(
                                  `/${menuItem?.slug}/${option?.slug}/${child?.slug}`,
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

            <div class="flex items-center justify-between">
              <div class="flex items-center justify-between">
                <div @click="toggleSearch">
                  <SearchHeader class="cursor-pointer mb-1 ml-5" />
                </div>
              </div>
            </div>
          </div> -->
          <div class="hidden lg:flex items-center justify-center">
            <UNavigationMenu
              arrow
              content-orientation="vertical"
              :items="navigationItems"
              class="w-full text-base"
              :ui="{
                childList: 'w-[400px]',
                childLinkLabel: 'whitespace-normal break-words leading-snug',
              }"
            />
          </div>
          <!-- <div class="hidden lg:block w-full">
            <RecursiveMenu :items="navigationItems" />
          </div> -->
        </div>
      </div>
    </div>

    <Drawer
      v-model:show="showDrawer"
      placement="left"
      :class-list="['w-[75%]', 'px-[18px]']"
    >
      <div class="mb-[350px]">
        <div class="w-full flex items-center py-2 mb-2 mt-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm ..."
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
          class="absolute z-[200] md:w-[90%] sm:w-[85%] w-[82%] rounded-2xl p-[15px] space-y-2 text-secondary border border-gray-200"
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

        <div
          to="/"
          class="text-secondary ml-2 pb-2 cursor-pointer"
          @click="
            () => {
              navigateTo('/');
              toggleMenu;
            }
          "
        >
          <span :class="{ 'text-primary': route.path === '/' }" class=""
            >Trang chủ</span
          >
        </div>
        <!-- <Divider class="my-[13px]" /> -->

        <UMenuMobile :items="visibleCategories" @item-click="toggleMenu" />
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
