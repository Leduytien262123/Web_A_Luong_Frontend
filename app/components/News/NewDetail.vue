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

function iframeSrc(file) {
  if (!file || !file.url) return "";
  try {
    const url = file.url;
    const ext = url.split(".").pop().split(/[#?]/)[0].toLowerCase();
    const officeExt = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
    const imageExt = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
    if (officeExt.includes(ext)) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    }
    if (ext === "pdf") {
      return url;
    }
    if (imageExt.includes(ext)) {
      return url;
    }
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  } catch (e) {
    console.log(e);
    return file.url || "";
  }
}

function isImage(file) {
  if (!file || !file.url) return false;
  try {
    const url = file.url;
    const ext = url.split(".").pop().split(/[#?]/)[0].toLowerCase();
    const imageExt = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
    return imageExt.includes(ext);
  } catch (e) {
    console.log(e);
    return false;
  }
}
</script>

<template>
  <div class="">
    <div class="">
      <h1 class="text-title text-[40px] font-medium">
        {{ newDetail?.title }}
      </h1>
    </div>
    <div v-if="newDetail?.published_at" class="flex items-center mt-2">
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

    <div v-if="newDetail?.content?.list_file?.length" class="mt-6">
      <h3 class="text-lg font-medium mb-2">Tệp đính kèm</h3>
      <div
        v-for="(file, idx) in newDetail?.content?.list_file"
        :key="idx"
        class="mb-6"
      >
        <template v-if="isImage(file)">
          <img
            :src="file.url || '/img/empty.jpg'"
            alt="attachment"
            style="
              display: block;
              width: auto;
              max-width: 100%;
              height: auto;
              max-height: 600px;
            "
          />
        </template>

        <template v-else>
          <div style="overflow: auto">
            <iframe
              v-if="iframeSrc(file)"
              :src="iframeSrc(file)"
              style="border: 0"
              class="w-full lg:h-[600px] h-[400px]"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </template>

        <div class="mt-2 text-sm">
          <a
            :href="file.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary"
            >Mở tệp trong tab mới</a
          >
        </div>
      </div>
    </div>

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
  color: #b68258 !important;
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
  color: #b68258;
}

:deep(.description-blog > span > a) {
  color: #b68258;
}

:deep(.description-blog > p > a) {
  color: #b68258;
}

:deep(.description-blog > a) {
  color: #b68258;
}
</style>
