<script setup lang="ts">
const newTrend = ref({
  name: `
  <h2 class="text-secondary font-medium text-[28px] leading-tight">Cập Nhật Tin Tức và Xu Hướng<br /> Du Lịch Mới Nhất Tại Sim247</h2>
  `,
  content: `
    <div class="text-secondary">
        <div>
            Nơi cập nhật những thông tin mới nhất, hữu ích dành cho khách hàng chuẩn bị cho các chuyến đi nước ngoài. Tại đây, bạn có thể tìm thấy các bài viết về mẹo sử dụng SIM và eSIM tiết kiệm, cách chọn gói dữ liệu phù hợp cho từng điểm đến, cũng như các hướng dẫn kích hoạt nhanh chóng và dễ dàng.
        </div>

        <div class="mt-4">
            Ngoài ra, trang còn cung cấp tin tức về xu hướng du lịch quốc tế, những thay đổi trong chính sách roaming, và các chương trình khuyến mãi hấp dẫn. Với nội dung được cập nhật thường xuyên, Sim247 không chỉ giúp bạn nắm bắt thông tin kịp thời mà còn mang đến những gợi ý giá trị để chuyến đi của bạn thêm thuận tiện và suôn sẻ.
        </div>

        <div class="mt-4 text-xl font-medium">Xem thêm dịch vụ WiFi quốc tế - WiFi247.vn</div>

        <div class="mt-4">
            Bắt đầu với việc nhập thông tin điểm đến tại mục “Châu Lục” và “Quốc gia” và thông tin ngày đi, ngày về và dung lượng Data WiFi cần sử dụng khi ở nước ngoài.  
        </div>
        <div class="mt-4">
            Sau khi hoàn tất đặt thuê WiFi và thanh toán, mọi thông tin sẽ được gửi về email và WiFi247 sẽ liên hệ lại quý khách để xác nhận lại đơn hàng.
            Trong trường hợp khách hàng cần gấp thuê dịch vụ WiFi quốc tế có thể liên hệ ngay tới Hotline:
        </div>

        <div class="mt-4 font-medium">
            <a href="tel:0903210101" class="text-blue-500">(HN) 0903.21.01.01</a> <br />
        </div>
        <div class="mt-4 font-medium">
            <a href="tel:0914261999" class="text-blue-500">(HCM) 0914.26.19.99</a>
        </div>

        <div class="mt-4">
            Với WiFi247, bạn không chỉ thuê WiFi quốc tế với mức giá tốt nhất, mà còn nhận được chất lượng dịch vụ Wifi du lịch tốt nhất.
        </div>
    </div>
    `,
});
</script>

<template>
  <div>
    <div v-html="newTrend.name"></div>
    <div v-html="newTrend.content" class="mt-5"></div>
  </div>
</template>
