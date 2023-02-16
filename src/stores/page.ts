import { ref } from "vue";
import { defineStore } from "pinia";

export const usePageStore = defineStore("page", () => {
  const page = ref(1);
  const review_page = ref(1);
  const setPage = (setpage: number) => {
    page.value = setpage;
  };
  const setReviewPage = (setpage: number) => {
    review_page.value = setpage;
  };
  return { page, setPage, review_page, setReviewPage };
});
