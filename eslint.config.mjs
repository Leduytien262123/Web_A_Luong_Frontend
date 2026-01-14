// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  // Custom ESLint rules for this project
  rules: {
    // Disable self-closing warnings for void HTML elements in Vue templates
    "vue/html-self-closing": "off",
  },
});
