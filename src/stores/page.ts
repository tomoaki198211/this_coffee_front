import { ref } from "vue";
import { defineStore } from "pinia";

export const usePageStore = defineStore("page", () => {
  const current_page = ref(1);
  const setPage = (page: number) => {
    current_page.value = page;
  };
  return { current_page, setPage };
});
