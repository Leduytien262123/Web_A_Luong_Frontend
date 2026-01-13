<template>
  <div class="">
    <div class="description_html" v-html="contentByCategory?.content"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  newsCategoryDetail: {
    type: Object,
    default: {},
  },
});

const contentByCategory = props?.newsCategoryDetail;
</script>

<style lang="css" scoped>
body a {
  text-decoration: none !important;
  color: #39b54a !important;
}

.description_html {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
  color: #373737;
}

:deep(.description_html h2) {
  display: block;
  font-size: 1.75em;
  padding-bottom: 12px;
}

:deep(.description_html h3) {
  font-size: 1.25rem;
  line-height: 1.5;
  font-weight: 600;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  color: #373737;
}

:deep(.description_html h4) {
  font-size: 1.2rem;
  line-height: 1.5;
  font-weight: 500;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  color: #373737;
}

:deep(.description_html h5) {
  font-size: 1.1rem;
  line-height: 1.5;
  font-weight: 400;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  color: #373737;
}

:deep(.description_html > h6) {
  font-size: 1em;
  line-height: 1.5;
  font-weight: 400;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  color: #373737;
}

:deep(.description_html > p > img) {
  display: inline;
  padding-top: 20px;
  padding-bottom: 20px;
}

:deep(.description_html > p > span > a) {
  color: #39b54a;
}

:deep(.description_html > span > a) {
  color: #39b54a;
}

:deep(.description_html > p > a) {
  color: #39b54a;
}

:deep(.description_html > a) {
  color: #39b54a;
}

:deep(.description_html p),
:deep(.description_html strong),
:deep(.description_html span) {
  margin-block-start: 8px;
  margin-block-end: 8px;
  font-weight: 400;
  color: #4e4e4e;
  margin-top: 8px;
}

:deep(.description_html ul) {
  margin-block-start: 8px;
  margin-block-end: 8px;
  font-weight: 400;
  color: #4e4e4e;
  margin-bottom: 8px;
}

:deep(.description_html audio),
:deep(.description_html video),
:deep(.description_html img) {
  display: inline;
  padding: 2px;
}
</style>
