<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import axios, { type AxiosResponse } from "axios";

const authStore = useAuthStore();
const search_store = ref("");
const search_category = ref("");
const search_word = ref("");

const categories = reactive({
  name = [],
});

const stores = reactive({
  name = [],
});

//1 axios このページを開いた際に諸々を取得する。コーヒーは直近２０件ほどに制限
//マスターは全て取得

//2 axios 検索結果を表示する
</script>

<template>
  <div>
    <input type="text" placeholder="Search" v-model="search_word" />
    <select v-model="item.intuition">
      <option
        v-for="evalution in evalutions"
        :value="evalution.id"
        :key="evalution.id"
      >
        {{ evalution.text }}
      </option>
    </select>
  </div>
</template>
