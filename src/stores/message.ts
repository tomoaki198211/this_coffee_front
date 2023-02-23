import { ref } from "vue";
import { defineStore } from "pinia";

export const useMessageStore = defineStore("message", () => {
  const text = ref("");
  const color = ref("");
  function flash(this: any, message: string, color: string = "#7b5544"): void {
    this.text = message;
    this.color = color;
    setTimeout(() => {
      this.text = "";
      this.color = "";
    }, 5000);
  }
  return { text, color, flash };
});
