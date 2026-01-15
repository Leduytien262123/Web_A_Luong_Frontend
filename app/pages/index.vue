<script setup>
const { restAPI } = useApi();
const config = useRuntimeConfig();

// const { data: resData } = await restAPI.stores.getListProductCategory({
//   params: {
//     current: 1,
//     pageSize: 9999,
//   },
// });
// const productCategoryList = resData.value.data ?? [];

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
    <!-- <CategoriesIndex
      :productCategoryList="productCategoryList"
      class="width-base"
    />
    <Advantage class="width-base" />
    <FAQ />
    <Partner class="width-base" />
    <ClientSim247 class="width-base" />
    <News class="width-base mt-[100px]" /> -->
  </div>
</template>
