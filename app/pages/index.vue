<script setup>
import Trait from "~/components/Main/Trait.vue";
import Develop from "~/components/Main/Develop.vue";

const { restAPI } = useApi();

const { data: resDataDetail } = await restAPI.articles.getDataCategoryHome({
  params: {
    page: 1,
    limit: 100,
  },
});

const { data: resDataHomePage } = await restAPI.articles.getDataPageHome({
  params: {
    page: 1,
    limit: 100,
  },
});

const listArticles = computed(
  () => resDataDetail.value?.data?.categories || [],
);

const homePageSections = computed(() => {
  const raw = resDataHomePage.value?.data;

  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.sections)) return raw.sections;
  if (Array.isArray(raw?.data)) return raw.data;

  return [];
});

// ============================================================
// COMPONENT MAP: Thêm component mới vào đây
// Key = type_key từ API, Value = Component
// ============================================================
const componentMap = {
  TYPE01: Trait,
  TYPE02: Develop,
  // Thêm component mới ở đây, ví dụ:
  // TYPE03: NewComponent,
};

function _getSectionPosition(section) {
  if (!section) return Number.MAX_SAFE_INTEGER;
  return (
    section.position ??
    section.display_order ??
    section.position_home ??
    section.position_menu ??
    section.position_footer ??
    section.order ??
    Number.MAX_SAFE_INTEGER
  );
}

function _getSectionTypeKey(section) {
  return section?.type_key || section?.typeKey || section?.type || section?.key;
}

const orderedHomeComponents = computed(() => {
  const items = [];

  homePageSections.value.forEach((section) => {
    const typeKey = _getSectionTypeKey(section);
    const component = componentMap[typeKey];

    if (component) {
      items.push({
        typeKey,
        component,
        section,
        pos: _getSectionPosition(section),
      });
    }
  });

  return items.sort((a, b) => a.pos - b.pos);
});

// useHead({
//   title: "Sim247 - Sim du lịch quốc tế",
//   link: [{ ref: "canonical", href: config.public.domainUrl }],
// });

// useSeoMeta({
//   title: "Sim247 - Sim du lịch quốc tế",
//   description:
//     "Sim247 - Sim du lịch quốc tế, Chuyên sim du lịch giá rẻ giá ngon đảm bảo chất lượng",
//   keywords: "sim du lịch, sim du lịch giá rẻ, sim du lịch chất lượng",
// });
</script>

<template>
  <div>
    <Banner class="" />

    <div class="width-base">
      <Blog :list-articles="listArticles" />

      <component
        :is="item.component"
        v-for="item in orderedHomeComponents"
        :key="item.typeKey"
        :section-data="item.section"
      />
    </div>
  </div>
</template>
