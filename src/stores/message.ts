import { ref } from "vue";
import { defineStore } from "pinia";

export const useMessageStore = defineStore("message", () => {
  const text = ref("");
  function flash(this: any, message: string): void {
    this.text = message;
    setTimeout(() => {
      this.text = "";
    }, 5000);
  }
  return { text, flash };
});
