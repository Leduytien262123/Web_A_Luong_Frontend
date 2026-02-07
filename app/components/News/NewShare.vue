<script setup>
const route = useRoute();

const shareToFacebook = () => {
  const urlToShare = `https://quantriduanxaydung.vn/${route.path}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    urlToShare,
  )}`;
  window.open(facebookShareUrl, "_blank");
};

const shareToMessenger = () => {
  const urlToShare = `https://quantriduanxaydung.vn/${route.path}`;
  const messengerShareUrl = `fb-messenger://share/?link=${encodeURIComponent(
    urlToShare,
  )}`;
  window.location.href = messengerShareUrl;
};

const shareToInstagram = async () => {
  const urlToShare = `https://quantriduanxaydung.vn/${route.path}`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Chia sẻ bài viết",
        text: "Hãy xem bài viết này!",
        url: urlToShare,
      });
    } catch (error) {
      console.error("Chia sẻ thất bại:", error);
    }
  } else {
    alert("Trình duyệt không hỗ trợ chia sẻ qua Instagram.");
  }
};

const shareToTwitter = () => {
  const urlToShare = `https://quantriduanxaydung.vn/${route.path}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    "Hãy xem bài viết này!",
  )}&url=${encodeURIComponent(urlToShare)}`;
  window.open(twitterShareUrl, "_blank");
};

const shareToPinterest = () => {
  const urlToShare = `https://quantriduanxaydung.vn/${route.path}`;
  const pinterestShareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    urlToShare,
  )}&description=${encodeURIComponent("Hãy xem bài viết này!")}`;
  window.open(pinterestShareUrl, "_blank");
};

const shareToTelegram = () => {
  const urlToShare = `https://quantriduanxaydung.vn/${route.path}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    urlToShare,
  )}&text=${encodeURIComponent("Hãy xem bài viết này!")}`;
  window.open(telegramShareUrl, "_blank");
};

const shareToLinkedIn = () => {
  const urlToShare = `https://quantriduanxaydung.vn/${route.path}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    urlToShare,
  )}`;
  window.open(linkedinShareUrl, "_blank");
};
</script>

<template>
  <div class="lg:mt-10 mt-5">
    <div class="text-secondary">Chia sẻ bài viết</div>
    <div class="mt-1 flex items-center space-x-4">
      <NewShareFB class="cursor-pointer" @click="shareToFacebook" />
      <!-- <NewShareTwitter class="cursor-pointer" @click="shareToTwitter" />
      <NewSharePinterest class="cursor-pointer" @click="shareToPinterest" />
      <NewShareTelegram class="cursor-pointer" @click="shareToTelegram" />
      <NewShareInstagram class="cursor-pointer" @click="shareToInstagram" />
      <NewShareLinkedin class="cursor-pointer" @click="shareToLinkedIn" /> -->
      <NewShareMessenger class="cursor-pointer" @click="shareToMessenger" />
    </div>
  </div>
</template>
