<script setup>
import { isObjectNullOrEmpty } from "../../../utils";

const route = useRoute();
const path = (route.path.split("/").filter(Boolean).pop() || "").toString();
const config = useRuntimeConfig();

const { restAPI } = useApi();

const { data: resDataDetail } = await restAPI.articles.getArticlesDetail(path);

const { data: featuredData } = await useAsyncData("articles-featured", () =>
  restAPI.articles.getArticleFeatured({
    params: { current: 1, pageSize: 100 },
  }),
);
const articlesFeatured = featuredData?.value?.data ?? featuredData?.value ?? [];

const { data: categoriesDataRaw } = await restAPI.articles.getArticleCategories(
  {
    params: { current: 1, pageSize: 100 },
  },
);

const categoriesRaw = categoriesDataRaw?.value?.data?.categories ?? [];

const { data: tagsData } = await useAsyncData("article-tags", () =>
  restAPI.articles.getArticleTags({ params: { current: 1, pageSize: 10 } }),
);
const tags = tagsData?.value?.data?.tags ?? tagsData?.value?.tags ?? [];

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mapImages = (list) =>
  Array.isArray(list)
    ? list.map((item) => ({
        alt: item?.alt || "",
        src: item?.src || item?.url || "",
      }))
    : [];

const normalizeNewDetail = (detail) => {
  if (!detail) return null;

  const metaImages = mapImages(
    detail?.metadata?.meta_image ?? detail?.metadata?.meta_images,
  );
  const coverPhotos = mapImages(
    detail?.content?.cover_photo ?? detail?.thumb_image,
  );
  const galleryImages = mapImages(detail?.content?.images);

  const tagList = Array.isArray(detail?.tags)
    ? detail?.tags
    : detail?.tag
      ? [detail?.tag]
      : [];

  const tags = tagList.map((tag) => ({
    id: tag?.id,
    name: tag?.name,
    slug: tag?.slug || slugify(tag?.name || "") || tag?.id,
  }));

  return {
    ...detail,
    name: detail?.title || detail?.name,
    description: detail?.content?.description || detail?.description,
    content: detail?.content?.content || detail?.content,
    slug: detail?.slug,
    published_at: detail?.published_at || detail?.publishedAt,
    category_name: detail?.category?.name || detail?.category_name,
    category_slug: detail?.category?.slug || detail?.category_slug,
    category_id: detail?.category?.id || detail?.category_id,
    tags,
    feature_image: coverPhotos.length
      ? coverPhotos
      : mapImages(detail?.feature_image),
    thumb_image: coverPhotos,
    gallery_images: galleryImages,
    metadata: {
      ...detail?.metadata,
      meta_images: metaImages,
    },
  };
};

const newDetail = normalizeNewDetail(resDataDetail.value);

if (isObjectNullOrEmpty(newDetail?.data)) {
  useHead({
    title: "404 Not Found",
  });
} else {
  useHead({
    title: newDetail?.data?.metadata?.meta_title || newDetail?.data?.name,
    link: [{ rel: "canonical", href: config.public.domainUrl + route.path }],
  });

  useSeoMeta({
    title: newDetail?.data?.metadata?.meta_title || newDetail?.data?.name,
    description:
      newDetail?.data?.metadata?.meta_description ||
      newDetail?.data?.description,
    keywords: newDetail?.data?.metadata?.meta_keywords,
    ogUrl: config.public.domainUrl + route.path,
    ogTitle: newDetail?.data?.metadata?.meta_title || newDetail?.data?.name,
    ogDescription:
      newDetail?.data?.metadata?.meta_description ||
      newDetail?.data?.description,
    ogLocale: "vi_VN",
    ogType: "website",
    ogImage:
      newDetail?.data?.metadata?.meta_images?.[0]?.src ||
      newDetail?.data?.thumb_image?.[0]?.src ||
      newDetail?.data?.feature_image?.[0]?.src,
  });
}

const linksBreadcrumb = computed(() => {
  const links = [{ label: "Trang chủ", to: "/", disabled: false }];

  const base = "/articles";

  if (!newDetail?.data) return links;

  const catName =
    newDetail?.data?.category_name || newDetail?.data?.category?.name;
  const catSlug =
    newDetail?.data?.category_slug || newDetail?.data?.category?.slug;

  if (catName && catSlug) {
    links.push({
      label: catName,
      to: `/${catSlug}`,
      disabled: false,
    });
  }

  links.push({
    label: newDetail?.data?.title || "Chi tiết",
    to: `${base}/${newDetail?.slug}`,
    disabled: true,
  });

  return links;
});
</script>

<template>
  <div class="">
    <div v-if="isObjectNullOrEmpty(newDetail)">
      <PageNotAvailable />
    </div>
    <div v-else class="md:mt-[40px] mt-3">
      <UBreadcrumb
        :items="linksBreadcrumb"
        class="text-center width-new mt-1"
      />

      <div class="width-new mt-[15px] flex">
        <NewDetail
          :new-detail="newDetail"
          class="lg:w-[70%] w-full lg:mr-[30px]"
        />

        <NewCategory
          class="lg:w-[30%] hidden lg:block"
          :categories-raw="categoriesRaw"
          :articles-featured="articlesFeatured"
          :tags="tags"
        />
      </div>
      <NewTrend class="width-base lg:mt-[100px] mt-20" />
      <NewCategory
        class="width-base lg:hidden mt-20"
        :categories-raw="categoriesRaw"
        :articles-featured="articlesFeatured"
        :tags="tags"
      />
    </div>
  </div>
</template>

<style>
.width-new {
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 1700px) {
  .width-new {
    max-width: 1230px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
