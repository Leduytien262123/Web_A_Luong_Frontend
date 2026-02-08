<script setup>
const emit = defineEmits(["on-change-page", "on-change-page-size"]);
const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  listArticles: {
    type: Array,
    default: () => [],
  },
  category: {
    type: Object,
    default: () => ({}),
  },
  pagination: {
    type: Object,
    default: () => ({}),
  },
});

const categories = computed(() =>
  props.categories.slice().sort((a, b) => {
    const pa = a?.position_menu ?? a?.display_order ?? 0;
    const pb = b?.position_menu ?? b?.display_order ?? 0;
    if (pa !== pb) return pa - pb;
    return (a?.name || "").localeCompare(b?.name || "");
  }),
);

const articles = computed(() => props.listArticles || []);
const totalItems = computed(
  () => props.pagination?.total ?? articles.value.length ?? 0,
);

const linksBreadcrumb = computed(() => {
  const links = [{ label: "Trang chủ", to: "/", disabled: false }];
  const current = props.category || null;
  if (!current || !current.id) return links;

  const chain = [];
  let node = current;
  while (node) {
    chain.push(node);
    const parentId = node.parent_id;
    if (!parentId) break;
    node = props.categories.find((c) => c.id === parentId) || null;
  }

  chain.reverse();
  let path = "";
  chain.forEach((cat, idx) => {
    path += `/${cat.slug}`;
    links.push({
      label: cat.name || cat.slug,
      to: path,
      disabled: idx === chain.length - 1,
    });
  });

  return links;
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const coverImage = (article) => {
  const cover = article?.content?.cover_photo?.[0];
  const meta = article?.metadata?.meta_image?.[0];
  const firstImage = article?.content?.images?.[0];

  return (
    cover?.url ||
    cover?.src ||
    meta?.url ||
    meta?.src ||
    firstImage?.url ||
    firstImage?.src ||
    "/img/empty.jpg"
  );
};

const cardItems = computed(() => {
  return (articles.value || []).map((article) => {
    const metaKeywords = article?.metadata?.meta_keywords;
    const keywords = Array.isArray(metaKeywords)
      ? metaKeywords
      : (metaKeywords || "")
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean);

    if (article?.tag?.name && !keywords.includes(article.tag.name)) {
      keywords.push(article.tag.name);
    }

    return {
      slug: article.slug,
      title: article.title,
      pic: coverImage(article),
      alt:
        article?.content?.cover_photo?.[0]?.alt ||
        article?.metadata?.meta_image?.[0]?.alt ||
        article.title,
      category: article.category,
      time: formatDate(article.published_at),
      tag: (() => {
        const t = article?.tag;
        if (!t) return [];
        if (Array.isArray(t)) return t.map((x) => x?.name || x).filter(Boolean);
        if (typeof t === "object") return [t.name].filter(Boolean);
        return [String(t)];
      })(),
      member: { username: article?.author?.full_name || "" },
    };
  });
});

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

const handleChangePage = (page) => {
  emit("on-change-page", page);
};

const handleChangePageSize = (size) => {
  emit("on-change-page-size", size);
};
</script>

<template>
  <div class="">
    <div class="xl:flex items-center justify-start">
      <UBreadcrumb :items="linksBreadcrumb" class="text-center" />
    </div>

    <div class="xl:mt-[30px] mt-[45px]">
      <header class="mb-8">
        <h1 class="xl:text-[28px] text-2xl text-title font-semibold">
          {{ category?.name }}
        </h1>
        <p v-if="category?.description" class="text-secondary mt-2">
          {{ category.description }}
        </p>
      </header>
      <div class="flex gap-6 justify-between">
        <div class="hidden xl:block w-1/4">
          <div class="bg-[#F2F2F2] p-5 rounded-2xl shadow-sm">
            <div
              v-for="(menuItem, index) in categories"
              :key="menuItem.id || index"
              class="py-2"
            >
              <div
                class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
                @click="
                  menuItem.children?.length
                    ? toggleCollapse(menuItem.id)
                    : navigateTo(`/bai-viet/tag/${menuItem.slug}`)
                "
              >
                <span
                  class="text-title font-medium"
                  @click="navigateTo(`/bai-viet/tag/${menuItem.slug}`)"
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

              <!-- <transition
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
                      class="relative ml-3 rounded-lg px-3 py-2 mt-3 hover:bg-white/80 transition-colors cursor-pointer"
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
                          @click="
                            navigateTo(`/${menuItem.slug}/${option.slug}`)
                          "
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
              </transition> -->
            </div>
          </div>
        </div>
        <div class="xl:w-3/4 w-full">
          <CardArticle v-if="articles?.length" :items="cardItems" />

          <div v-else class="text-center text-secondary py-10">
            Danh mục chưa có bài viết.
          </div>
        </div>
      </div>
    </div>

    <Pagination
      v-if="pagination && (pagination.total_pages || pagination.total)"
      :total="pagination.total ?? totalItems"
      :totalPages="
        pagination.total_pages ??
        Math.ceil(
          (pagination.total || totalItems) /
            (pagination.limit || pagination.page_size || 10),
        )
      "
      :currentPage="pagination.page ?? 1"
      :defaultPageSize="
        pagination.limit || pagination.page_size || pagination.per_page || 10
      "
      class="mt-10 flex xl:justify-end justify-center"
      @on-change-page="handleChangePage"
      @on-change-page-size="handleChangePageSize"
    />
  </div>
</template>
