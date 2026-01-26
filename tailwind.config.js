import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './node_modules/@nuxt/ui/dist/**/*.{js,mjs}' // 🔥 DÒNG QUYẾT ĐỊNH
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
