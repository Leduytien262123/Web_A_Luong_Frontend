<template>
  <section ref="targetRef" class="section section-container">
    <div v-for="category in categoriesList" :key="category?.id" class="mt-20">
      <div class="section-title text-center mb-10">
        <h1 class="text-[50px] font-bold">
          Bài viết tiêu biểu về {{ category?.name }}
        </h1>
        <p class="text-[#808080] mb-10 mt-2">
          {{ category?.description }}
        </p>
      </div>

      <div class="article">
        <div class="grid grid-cols-12 gap-5">
          <div
            v-for="item in category?.articles"
            :key="item?.id || item?.slug || item?.title"
            class="col-span-12 md:col-span-6 lg:col-span-3"
          >
            <div class="h-full flex flex-col overflow-hidden bg-white">
              <div class="relative aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  :src="getArticleImage(item)"
                  :alt="getArticleAlt(item)"
                  class="h-full w-full object-cover transition duration-500 hover:scale-[1.05]"
                  loading="lazy"
                />
              </div>
              <div
                class="flex items-center justify-between mt-4 text-sm text-[#808080]"
              >
                <span class="font-medium text-[#111]">{{
                  category.name || item?.category?.name
                }}</span>
                <span>{{ formatDate(item?.published_at) }}</span>
              </div>
              <h3
                class="mt-3 text-lg font-semibold leading-6 text-[#111] line-clamp-2 cursor-pointer"
                @click="navigateTo(`/articles/${item?.slug}`)"
              >
                {{ item?.title }}
              </h3>
              <div class="mt-2 flex flex-wrap gap-2 text-xs">
                <UBadge
                  v-for="tag in item?.tag_names"
                  :key="tag"
                  variant="soft"
                  color="primary"
                >
                  {{ tag }}
                </UBadge>
              </div>
              <div class="mt-auto pt-4 flex items-center justify-between">
                <div
                  v-if="item?.member?.username"
                  class="flex items-center gap-2 text-sm text-[#555]"
                >
                  <UIcon name="ph:user" class="h-4 w-4" aria-hidden="true" />
                  <span>{{ item?.member?.username || "" }}</span>
                </div>
                <!-- <UButton
                  v-if="item?.url"
                  color="primary"
                  variant="solid"
                  size="sm"
                  class="px-2"
                
                >
                  Đọc bài
                </UButton> -->
              </div>
              <div class="flex justify-center mt-4">
                <Button4
                  v-if="item?.slug"
                  :title="'Đọc bài'"
                  :width="100"
                  :height="8"
                  @click="navigateTo(`/articles/${item?.slug}`)"
                />
              </div>
            </div>
          </div>
          <UCard
            v-if="totalArticlesCount === 0"
            class="h-full flex flex-col gap-3"
          >
            <USkeleton class="h-[160px] w-full" />
            <USkeleton class="h-4 w-2/3" />
            <USkeleton class="h-4 w-full" />
            <div class="flex gap-2">
              <USkeleton class="h-4 w-16" />
              <USkeleton class="h-4 w-20" />
            </div>
            <div class="flex justify-between items-center mt-auto pt-2">
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-8 w-16" />
            </div>
          </UCard>
        </div>
      </div>

      <div
        v-if="category?.articles?.length > 4"
        class="flex justify-center mt-10 h-12"
      >
        <Button4 :title="'Xem tất cả'" />
      </div>
    </div>
  </section>
</template>
<script setup>
const props = defineProps({
  categories: { type: Array, default: () => [] },
  listArticles: { type: Array, default: () => [] },
});

const categoriesList = computed(() => {
  const hasArticles = (c) => {
    if (!c) return false;
    const a = c.articles;
    if (!a) return false;
    if (Array.isArray(a)) return a.length > 0;
    if (typeof a === "object") return Object.keys(a).length > 0;
    return false;
  };

  let list = [];
  if (Array.isArray(props.categories) && props.categories.length) {
    list = props.categories;
  } else if (Array.isArray(props.listArticles) && props.listArticles.length) {
    list = props.listArticles;
  }

  return list.filter((c) => hasArticles(c));
});

const totalArticlesCount = computed(() =>
  categoriesList.value.reduce(
    (sum, c) => sum + ((c.articles && c.articles.length) || 0),
    0,
  ),
);

function getArticleImage(item) {
  return (
    item?.content?.cover_photo?.[0]?.url ||
    item?.metadata?.meta_image?.[0]?.url ||
    ""
  );
}

function getArticleAlt(item) {
  return (
    item?.content?.images?.[0]?.alt ||
    item?.metadata?.meta_image?.[0]?.alt ||
    item?.title ||
    ""
  );
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
</script>
<style scoped>
.section {
  padding-top: 60px;
  padding-bottom: 60px;
  /* background-color: #ffffff; */
  position: relative;
  overflow: hidden;

  &-title {
    margin-bottom: 30px;
    text-align: center;

    h1 {
      font-size: 50px;
      font-weight: bold;
    }
  }

  .action {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style>
