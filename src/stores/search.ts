import { ref, reactive } from "vue";
import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", () => {
  type search = {
    id: string | number;
    name: null | string;
  };
  const search_word = ref("");
  const selected_category: search = reactive({ id: "", name: "" });
  const selected_store: search = reactive({ id: "", name: "" });

  const review_search_word = ref("");
  const review_selected_category: search = reactive({ id: "", name: "" });
  const review_selected_store: search = reactive({ id: "", name: "" });
  const review_isall = ref(false);

  const setWord = (word: string) => {
    search_word.value = word;
  };
  const setCategory = (category: string | number) => {
    selected_category.id = category;
  };
  const setStore = (store: string | number) => {
    selected_store.id = store;
  };

  const setReviewWord = (word: string) => {
    review_search_word.value = word;
  };
  const setReviewCategory = (category: string | number) => {
    review_selected_category.id = category;
  };
  const setReviewStore = (store: string | number) => {
    review_selected_store.id = store;
  };

  const setReviewisAll = (isAll: boolean) => {
    review_isall.value = isAll;
  };
  return {
    search_word,
    selected_category,
    selected_store,
    review_search_word,
    review_selected_category,
    review_selected_store,
    review_isall,
    setWord,
    setCategory,
    setStore,
    setReviewWord,
    setReviewCategory,
    setReviewStore,
    setReviewisAll,
  };
});
