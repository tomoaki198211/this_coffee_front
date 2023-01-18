import { defineStore } from "pinia";

export const useMessageStore = defineStore({
  id: "message",
  state: () => ({
    text: "",
  }),

  actions: {
    message_display(message: string): void {
      this.text = message;
      setTimeout(() => {
        this.text = "";
      }, 3000);
    },
  },
});
