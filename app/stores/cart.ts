import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartQuantity: 0,
  }),
  actions: {
    setCartQuantity(quantity: number) {
      this.cartQuantity = quantity;
    },
    increment(amount = 1) {
      this.cartQuantity += amount;
    },
    clear() {
      this.cartQuantity = 0;
    },
  },
});
