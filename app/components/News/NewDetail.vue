<script setup>
const props = defineProps({
  newDetail: {
    type: Object,
    default: () => ({}),
  },
});

const newDetail = props?.newDetail?.data;

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
</script>

<template>
  <div class="">
    <div class="">
      <h1 class="text-title text-[40px] font-medium">
        {{ newDetail?.title }}
      </h1>
    </div>
    <div class="flex items-center mt-2">
      <div class="text-primary">
        Đăng ngày:
        {{ formatDate(newDetail?.published_at) }}
      </div>
    </div>
    <div
      v-html="newDetail?.content?.description"
      class="description-blog text-secondary"
    ></div>
    <div
      v-html="newDetail?.content?.content"
      class="-pt-10 description-blog text-secondary"
    ></div>
    <div class="flex flex-wrap gap-4 mt-8">
      <div
        v-for="tag in newDetail?.tags"
        :key="tag.slug"
        class="text-primary flex items-center cursor-pointer px-4 py-1 bg-[#DBEFDE] rounded-md"
        @click="navigateTo(`/tin-tuc/tag/${tag?.slug}`)"
      >
        {{ tag?.name }}
      </div>
    </div>

    <NewShare />
  </div>
</template>

<style lang="css" scoped>
body a {
  text-decoration: none !important;
  color: #39b54a !important;
}

:deep(.description-blog > h2) {
  display: block;
  font-size: 1.5em;
  margin-block-start: 20px;
  margin-block-end: 20px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  /* font-weight: bold; */
  color: #373737;
}

:deep(.description-blog > p) {
  display: block;
  margin-block-start: 20px;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  line-height: 1.5;
  font-weight: 400;
  color: #4e4e4e;
}

:deep(.description-blog > h3) {
  display: block;
  font-size: 1.2em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  color: #373737;
  unicode-bidi: isolate;
}

:deep(.description-blog > h4) {
  display: block;
  font-size: 1.1em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  color: #373737;
  unicode-bidi: isolate;
}

:deep(.description-blog > h5) {
  display: block;
  font-size: 1em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  color: #373737;
  unicode-bidi: isolate;
}

:deep(.description-blog > h6) {
  display: block;
  font-size: 0.9em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  color: #373737;
  unicode-bidi: isolate;
}

:deep(.description-blog > p > img) {
  display: inline;
  padding-top: 20px;
  padding-bottom: 20px;
}

:deep(.description-blog > p > span > a) {
  color: #39b54a;
}

:deep(.description-blog > span > a) {
  color: #39b54a;
}

:deep(.description-blog > p > a) {
  color: #39b54a;
}

:deep(.description-blog > a) {
  color: #39b54a;
}
</style>
