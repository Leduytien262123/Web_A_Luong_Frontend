<script setup>
const { restAPI } = useApi();

const activeTab = ref("FAQ");
const faqContent = ref([]);
const policyContent = ref(null);
const showModalTel = ref(false);
const isVisible = ref(false);
const sectionRef = ref(null);

const { data: resDataFaq } = await restAPI.stores.getFAQ();
faqContent.value = resDataFaq.value?.data || [];
faqContent.value.sort((c1, c2) => c1.position - c2.position);

function switchTab(tab) {
  activeTab.value = tab;
}

const handleModalTel = () => {
  showModalTel.value = !showModalTel.value;
};

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          isVisible.value = true;
          observer.disconnect();
        }, 1000);
      }
    },
    { threshold: 0 },
  );
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});
</script>

<template>
  <div ref="sectionRef" class="bg-[#DBEFDE] xl:py-[100px] py-[75px]">
    <div class="width-base xl:flex">
      <div class="xl:w-[35%] xl:mr-[30px] flex items-center">
        <div
          v-if="isVisible"
          :class="{ 'animZoomIn reveal active': isVisible }"
        >
          <div class="text-title text-[28px] font-medium">
            Chúng tôi rất vui<br />
            khi được hỗ trợ bạn.
          </div>
          <div class="text-base text-secondary my-[15px]">
            Sim247 là một trong những cửa hàng Sim du lịch tốt nhất trên thế
            giới. Xu hướng mới cùng công nghệ mới cung cấp giải pháp gói dữ liệu
            cho 200+ quốc gia và khu vực cho khách du lịch toàn cầu. Sim247
            không chỉ là trải nghiệm mà còn là niềm cảm ứng khám phá văn hóa du
            lịch trong mỗi chuyến đi hạnh phúc.
          </div>
          <div class="flex items-center">
            <button
              class="rounded-full bg-primary text-white py-3 px-6 mr-[15px] hover:scale-105 transition duration-300 ease-in-out"
            >
              Xem thêm FAQ
            </button>
            <button
              class="py-3 px-6 border border-[#39B54A] rounded-full flex items-center hover:scale-105 transition duration-300 ease-in-out"
              @click="showModalTel = true"
            >
              <span class="mr-2 text-primary">Liên hệ ngay</span>
              <Calling2 />
            </button>
          </div>
        </div>
      </div>

      <div class="xl:w-[65%] mt-10 xl:mt-0">
        <div
          v-if="isVisible"
          class="flex items-center justify-center"
          :class="{ 'reveal animRight active': isVisible }"
        >
          <button
            class="py-3 px-6 rounded-tl-xl rounded-tr-xl transition duration-300"
            :class="
              activeTab === 'FAQ'
                ? '  text-primary border'
                : 'bg-primary text-white'
            "
            @click="switchTab('FAQ')"
          >
            FAQ
          </button>
          <button
            class="py-3 px-6 rounded-tl-xl rounded-tr-xl transition duration-300"
            :class="
              activeTab === 'Policy'
                ? '  text-primary border'
                : 'bg-primary text-white'
            "
            @click="switchTab('Policy')"
          >
            Chính sách
          </button>
        </div>

        <div
          v-if="isVisible"
          :class="{ 'animTop reveal active': isVisible }"
          class="lg:p-[30px] p-4 rounded-lg"
        >
          <div v-if="activeTab === 'FAQ'" class="space-y-5">
            <div
              v-for="(item, index) in faqContent.slice(0, 5)"
              :key="index"
              class=""
            >
              <div class="flex items-start font-medium text-title">
                <div class="text-title">
                  {{ index + 1 }}. {{ item?.question }}
                </div>
              </div>
              <div
                class="description_html text-secondary"
                v-html="item?.answer"
              ></div>
            </div>
          </div>
          <div
            v-if="activeTab === 'Policy'"
            class="text-secondary"
            v-html="policyContent"
          ></div>
        </div>
      </div>
    </div>

    <div
      v-if="showModalTel"
      :class="{ 'opacity-100': showModalTel }"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] transition-opacity duration-500 opacity-0"
      @click.self="handleModalTel"
    >
      <div
        class="rounded-lg p-6 w-96 transform transition-all duration-300 ease-out"
        :class="{
          'translate-y-4 opacity-0': !showModalTel,
          'translate-y-0 opacity-100': showModalTel,
        }"
      >
        <div class="w-full flex justify-end">
          <CloseBlack class="cursor-pointer" @click="handleModalTel" />
        </div>
        <h3 class="text-lg font-semibold text-title text-center mb-4">
          Gọi điện cho chúng tôi
        </h3>
        <div class="flex flex-col space-y-4">
          <a href="tel:0903210101">
            <button class="bg-primary text-white py-2 px-4 rounded w-full">
              <div class="flex flex-col items-center align-center min-w-[60px]">
                Hà Nội
              </div>
            </button>
          </a>
          <a href="tel:0914261999">
            <button class="bg-primary text-white py-2 px-4 rounded w-full">
              <div class="flex flex-col items-center align-center min-w-[60px]">
                Hồ Chí Minh
              </div>
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
:deep(.description_html > div > h2) {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  color: #373737;
}

:deep(.description_html > div > p) {
  margin-block-start: 20px;
  margin-block-end: 20px;
  font-weight: 400;
  color: #4e4e4e;
}
:deep(.description_html > div > h3) {
  display: block;
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  color: #373737;
  unicode-bidi: isolate;
}

:deep(.description_html > div > audio, video, img) {
  display: inline;
  padding: 2px;
}
</style>
