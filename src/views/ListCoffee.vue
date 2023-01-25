<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import axios, { type AxiosResponse } from "axios";

const authStore = useAuthStore();
const search_store = ref("");
const search_category = ref("");
const search_word = ref("");
const index = reactive({
  coffees: [],
});

const categories = ref([]);
const stores = ref([]);

setCoffee();
setMaster();

//0マスター取得用
async function setMaster(): Promise<void> {
  await axios
    .get("http://localhost:3000/api/v1/coffees/mdata", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      categories.value = response.data.category;
      stores.value = response.data.store;
    });
}

//1 axios コーヒーは直近1０件ほどに制限
async function setCoffee(): Promise<void> {
  await axios
    .get("http://localhost:3000/api/v1/coffees", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.coffees = response.data;
      console.log(response.data);
    });
}

//2 axios 検索結果を表示する
async function setSearch(): Promise<void> {
  await axios
    .post("http://localhost:3000/api/v1/coffees/search", {
      search: {
        word: search_word.value,
        category: search_category.value,
        store: search_store.value,
      },
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.coffees = response.data;
      console.log(response.data);
    });
}
</script>

<template>
  <div>
    <div>
      <input type="text" placeholder="Search" v-model="search_word" />
      <select v-model="search_category">
        <option
          v-for="category in categories"
          :value="category.id"
          :key="category.id"
        >
          {{ category.name }}
        </option>
      </select>
      <select v-model="search_store">
        <option v-for="store in stores" :value="store.id" :key="store.id">
          {{ store.name }}
        </option>
      </select>
    </div>
    <div>
      <ul>
        <li v-for="coffee in index.coffees" :key="coffee.id">
          販売店:{{ coffee.coffee_property.store.name }}<br />
          商品名:{{ coffee.coffee_property.name }}<br />
          商品名:{{ coffee.coffee_property.price }}円
          <RouterLink
            v-bind:to="{ name: 'post_review', params: { id: coffee.id } }"
          >
            この商品のレビューを書く
          </RouterLink>
        </li>
      </ul>
    </div>
    <button @click="setSearch()">検索</button>
  </div>
</template>
