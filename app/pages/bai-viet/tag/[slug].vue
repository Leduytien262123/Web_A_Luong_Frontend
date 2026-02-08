<script setup>
const { restAPI } = useApi();
const config = useRuntimeConfig();
const route = useRoute();

const categorySegments = Array.isArray(route.params.categories)
  ? route.params.categories
  : [route.params.categories].filter(Boolean);
const slug = categorySegments.at(-1) || "";

const { data: resData } = await restAPI.articles.getArticleCategories({
  params: {
    page: 1,
    limit: 100,
  },
});

const categories = resData.value?.data?.categories || [];
const flattenSlugs = (nodes) => {
  const out = [];
  const stack = Array.isArray(nodes) ? [...nodes] : [];
  while (stack.length) {
    const node = stack.shift();
    if (!node) continue;
    if (node.slug) out.push(node.slug);
    if (Array.isArray(node.children) && node.children.length) {
      stack.unshift(...node.children);
    }
  }
  return out;
};

const knownSlugs = flattenSlugs(categories);

const rawTagSlug = route?.params?.slug;
const tagSlug = Array.isArray(rawTagSlug)
  ? rawTagSlug.at(-1)
  : rawTagSlug || "";

const { data: resDataDetail } = await restAPI.articles.getArticlesByTag(
  tagSlug,
  {
    params: {
      page: 1,
      limit: 10,
    },
  },
);

const categoryDetail = computed(
  () => resDataDetail.value?.data?.category || {},
);
const listArticles = computed(() => resDataDetail.value?.data?.articles || []);
const pagination = computed(() => {
  return resDataDetail.value?.data?.pagination || {};
});

const { data: resTags } = await restAPI.articles.getArticleTags({
  params: { page: 1, limit: 100 },
});

const dataTags = resTags.value?.data?.tags || [];
const knownTagSlugs =
  resTags.value?.data?.tags?.map((t) => String(t.slug).toLowerCase().trim()) ||
  [];

const normalized = decodeURIComponent(tagSlug || "").toLowerCase();
const isSlugValid = computed(
  () => !!normalized && knownTagSlugs.includes(normalized),
);

watchEffect(() => {
  if (!isSlugValid.value) {
    useHead({ title: "404 Not Found" });
    return;
  }

  const category = categoryDetail.value;
  const meta = category?.metadata || {};
  const title = meta.meta_title || category?.name || "";
  const description = meta.meta_description || category?.description || "";
  const image =
    meta.meta_image?.[0]?.src ||
    category?.thumb_image?.[0]?.src ||
    category?.feature_image?.[0]?.src;

  useHead({
    title,
    link: [{ rel: "canonical", href: config.public.domainUrl + route.path }],
  });

  useSeoMeta({
    title,
    description,
    keywords: meta.meta_keywords,
    ogUrl: config.public.domainUrl + route.path,
    ogLocale: "vi_VN",
    ogType: "website",
    ogImage: image,
  });
});
</script>

<template>
  <div class="">
    <div v-if="!isSlugValid">
      <PageNotAvailable />
    </div>
    <div v-else class="">
      <TagDetail
        class="width-base mt-[60px]"
        :categories="dataTags"
        :list-articles="listArticles"
        :category="categoryDetail"
        :pagination="pagination"
      />
    </div>
  </div>
</template>
