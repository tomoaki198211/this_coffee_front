<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import axios, { type AxiosResponse } from "axios";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const index = reactive({
  reviews: [],
});
setReview();

async function setReview(): Promise<void> {
  await axios
    .get("http://localhost:3000/api/v1/reviews", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.reviews = response.data;
      console.log(response.data);
    });
}
</script>

<template>
  <div>
    <ul>
      <li v-for="review in index.reviews" :key="review.id">
        <RouterLink v-bind:to="{ name: 'review', params: { id: review.id } }">
          投稿者:{{ review.user.name }}<br />
          備考:{{ review.remarks }}<br />
          商品名:{{ review.coffee.coffee_property.name }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
