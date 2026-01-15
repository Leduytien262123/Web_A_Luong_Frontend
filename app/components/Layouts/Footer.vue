<template>
  <div class="bg-[#F2F2F2] lg:mt-[100px] mt-20">
    <div
      class="text-secondary width-base xl:pb-[54px] xl:pt-[69px] flex justify-between flex-col gap-x-[30px] lg:flex-row py-[60px]"
    >
      <div class="relative lg:w-[510px]">
        <div class="w-[155px] h-14">
          <NuxtLink to="/">
            <NuxtImg
              src="/img/logo.png"
              alt="logo"
              class="w-full h-full object-cover"
          /></NuxtLink>
        </div>
        <div class="text-base mt-6">
          <div class="py-1.5 flex items-center">
            <Address />
            <span class="ml-3">
              Thông tin liên hệ: Luật sư Lê Duy Lượng, Đoàn Luật sư Thành phố Hồ
              Chí Minh
            </span>
          </div>
          <div class="py-1.5 flex items-center">
            <Phone />
            <span class="ml-3"> 0961.646.868 </span>
          </div>
          <div class="py-1.5 flex items-center">
            <MessageCskh />
            <span class="ml-3"> Zalo: 0961.646.868 </span>
          </div>
        </div>
      </div>

      <div v-if="PC" class="flex-col w-[180px]">
        <div class="text-lg text-title py-1.5 font-medium">Về chúng tôi</div>
        <div v-for="link in aboutUs" :key="link.id" class="py-1.5">
          <span class="cursor-pointer" @click="navigateTo(`/${link.slug}`)">{{
            link.text
          }}</span>
        </div>
      </div>

      <div v-else class="flex my-10">
        <div class="w-[50%]">
          <div class="text-lg text-title py-1.5 font-medium">Sản phẩm</div>
          <div v-for="link in filteredProducts" :key="link.id" class="py-1.5">
            <span
              v-if="link?.visible_footer === 1"
              class="cursor-pointer"
              @click="navigateTo(constructCategoryPath(link))"
            >
              {{ link.name }}</span
            >
          </div>
        </div>

        <div class="w-[50%]">
          <div class="text-lg text-title py-1.5 font-medium">Về chúng tôi</div>
          <div v-for="link in aboutUs" :key="link.id" class="py-1.5">
            <span class="cursor-pointer" @click="navigateTo(`/${link.slug}`)">{{
              link.text
            }}</span>
          </div>
        </div>
      </div>

      <div class="w-[286px]">
        <div class="text-lg text-title py-2 font-medium">
          Kết nối với Luật đất đai
        </div>
        <div class="py-1 flex">
          <!-- <div
            class="mr-1.5 w-10 h-10 flex items-center justify-center rounded-xl bg-white"
          >
            <a href="" class=""> <Twitter /></a>
          </div> -->
          <!-- <div
            class="mx-1.5 w-10 h-10 flex items-center justify-center rounded-xl bg-white"
          >
            <CallPhone />
          </div> -->
          <div
            class="ml-1.5 w-10 h-10 flex items-center justify-center rounded-xl bg-white"
          >
            <a
              href="https://www.facebook.com/wifiquocte247"
              target="_blank"
              class=""
            >
              <Facebook
            /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="w-full h-[68px] bg-primary flex items-center justify-center text-white text-base"
  >
    2026 @ Bản quyền thuộc về Duy Tiến
  </div>
</template>

<script setup>
const aboutUs = ref([]);
const width = ref(0);
const updateWidth = () => {
  if (import.meta.client) {
    width.value = window.innerWidth;
  }
};
onMounted(() => {
  if (import.meta.client) {
    width.value = window.innerWidth;
    window.addEventListener("resize", updateWidth);
  }
});
onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("resize", updateWidth);
  }
});

const PC = computed(() => width.value >= 1024);

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
});

const products = props.categories;

const filteredProducts = computed(() =>
  products.filter((item) => item.visible_footer === 1)
);
</script>
