<template>
  <section ref="targetRef" class="py-[60px] bg-[#00000033] section-container">
    <div>
      <h1 class="text-[50px] text-white font-bold text-center">
        Liên hệ với tôi
      </h1>
      <p class="text-white mb-10 text-center">
        Nếu bạn có thắc mắc khác, hãy gửi tin nhắn bên dưới để liên hệ với tôi
        (vấn đề sử dụng blog vui lòng tham gia nhóm hoặc xem tài liệu hướng
        dẫn).
      </p>
    </div>
    <div class="grid grid-cols-12 gap-x-[30px] gap-y-[10px]">
      <div class="col-span-12 lg:col-span-4 message-input">
        <input
          v-model="compData.fromData.name"
          placeholder="Tên của bạn"
          class="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div class="col-span-12 lg:col-span-4 message-input">
        <input
          v-model="compData.fromData.email"
          placeholder="Email của bạn"
          class="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div class="col-span-12 lg:col-span-4 message-input">
        <input
          v-model="compData.fromData.url"
          placeholder="Website của bạn (có thể để trống)"
          class="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    </div>
    <div class="flex mt-3">
      <textarea
        v-model="compData.fromData.message"
        rows="6"
        maxlength="500"
        placeholder="Nội dung tin nhắn"
        class="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
      ></textarea>
    </div>
    <div class="flex justify-end mt-3">
      <button
        class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-base rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="compData.disabled"
      >
        {{ compData.text }}
      </button>
    </div>
  </section>
</template>
<script setup>
const compData = reactive({
  fromData: {
    email: "",
    name: "",
    url: "",
    message: "",
  },
  text: "Gửi tin nhắn",
  disabled: false,
});
</script>
