<script setup>
const { restAPI } = useApi();
const config = useRuntimeConfig();
const route = useRoute();

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

const tagDetail = computed(() => resDataDetail.value?.data?.tag || {});
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

  const tag = tagDetail.value;
  const meta = tag?.metadata || {};
  const title = meta.meta_title || tag?.name || "";
  const description = meta.meta_description || tag?.description || "";
  const image =
    meta.meta_image?.[0]?.src ||
    tag?.thumb_image?.[0]?.src ||
    tag?.feature_image?.[0]?.src;

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
        :tags="dataTags"
        :list-articles="listArticles"
        :tag="tagDetail"
        :pagination="pagination"
      />
    </div>
  </div>
</template>
