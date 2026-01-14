// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  ssr: false,

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
    "nuxt-swiper",
  ],

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      htmlAttrs: {
        lang: "vi",
      },
      meta: [
        { name: "robots", content: "index, follow" },
        { name: "format-detection", content: "telephone=no" },
        {
          name: "ahrefs-site-verification",
          content:
            "c7ded25aec263347525cb4059d48486bced7da25f86ddddd5b785b5e5c078a43",
        },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico" },
        { rel: "shortcut icon", href: "/favicon.ico" },
      ],
    },
  },

  css: ["~/assets/css/main.css", "swiper/css", "swiper/css/pagination"],
});
