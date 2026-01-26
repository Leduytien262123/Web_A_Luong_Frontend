<template>
  <section ref="targetRef" class="bg-[#dbbf56] py-[60px] section-container">
    <div>
      <h1 class="text-[50px] text-white font-bold text-center">Đánh giá</h1>
      <p class="text-white mb-10 text-center">
        Dưới đây là một số đánh giá của người dùng Bag về hệ thống blog này.
      </p>
    </div>
    <div class="grid grid-cols-12 gap-x-[20px] gap-y-[10px]">
      <div
        v-for="(item, index) in compData.items"
        :key="item"
        class="col-span-12 md:col-span-6 lg:col-span-4"
        v-bind="fadeUp(index * 0.15 + 0.15)"
      >
        <div
          class="bg-white p-[25px] rounded-[4px] text-left text-[#333] flex flex-col"
        >
          <div class="text-[#909090] text-[15px]">
            {{ item.message }}
          </div>
          <div class="flex mt-[30px] items-center">
            <svg
              class="h-[30px] w-[30px]"
              style="color: #e96656"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path
                d="M212,80a28,28,0,1,0-28-28A28,28,0,0,0,212,80Zm0-40a12,12,0,1,1-12,12A12,12,0,0,1,212,40ZM72,108a28,28,0,1,0-28-28A28,28,0,0,0,72,108Zm0-40a12,12,0,1,1-12,12A12,12,0,0,1,72,68ZM92,88a28,28,0,1,0,28,28A28,28,0,0,0,92,88Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,92,128Zm72-40a28,28,0,1,0,28,28A28,28,0,0,0,164,88Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,164,128Zm23.12,62.93C172.21,170.88,147.8,156,128,156s-44.21,14.88-59.12,34.93a8,8,0,1,0,13.85,8C94.82,178.43,114.22,172,128,172s33.18,6.43,45.27,26.93a8,8,0,0,0,13.85-8Z"
              />
            </svg>
            <div class="flex-1 ml-3">
              <h6>{{ item.name }}</h6>
              <p>{{ item.createTime }}</p>
            </div>
            <div
              class="client-head rounded-[50%] w-[50px] h-[50px] overflow-hidden"
            >
              <img
                class="vertical-mid"
                src="@/packages/assets/yanghang.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
const compData = reactive({
  items: [
    {
      message:
        "Tôi là một người mới học lập trình, nhưng trên mạng có quá nhiều mã nguồn không hoàn chỉnh hoặc phải trả phí! Sau khi tìm kiếm trên Github, cuối cùng tôi đã tìm thấy hệ thống blog mã nguồn mở vue-bag-admin mà tôi mong muốn. Hệ thống này rất tốt, giao diện đẹp, quan trọng nhất là tác giả rất thân thiện, không thu phí. Tôi đã nhanh chóng xây dựng blog lcm của riêng mình, cảm giác rất tuyệt! Tuy còn một số thiếu sót, nhưng tôi tin tác giả sẽ tiếp tục hoàn thiện! Cố lên Bag, hệ thống có tâm!",
      name: "Minh Pluto",
      createTime: "2022-06-23 18:45:47",
    },
    {
      message:
        "Dùng khá ổn, phong cách đơn giản, có gì không hiểu có thể hỏi tác giả. Anh ấy rất kiên nhẫn giải đáp (thường thì bảo “hỏi quản trị viên”) @Mr. Yang là người rất tốt, nói chung khuyên mọi người nên thử chương trình này, không thử sẽ tiếc đó.",
      name: "Minh Pluto",
      createTime: "2022-06-23 18:45:47",
    },
    {
      message:
        "Dùng khá ổn, phong cách đơn giản, có gì không hiểu có thể hỏi tác giả. Anh ấy rất kiên nhẫn giải đáp (thường thì bảo “hỏi quản trị viên”) @Mr. Yang là người rất tốt, nói chung khuyên mọi người nên thử chương trình này, không thử sẽ tiếc đó.",
      name: "Minh Pluto",
      createTime: "2022-06-23 18:45:47",
    },
  ],
});
</script>
