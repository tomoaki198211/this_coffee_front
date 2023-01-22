<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import axios, { type AxiosResponse } from "axios";
interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const show = ref("");

setReview();

async function setReview(): Promise<void> {
  await axios
    .get(`http://localhost:3000/api/v1/reviews/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      show.value = response.data;
    });
}
</script>

<template>
  <div>
    <div>
      <p>{{ show }}</p>
      <label for="username"> username</label>
      <p>{{ show ? show.review.user.name : "" }}</p>
    </div>
    <div>
      <label for="coffeename"> coffeename</label>
      <p>{{ show ? show.review.coffee.coffee_property.name : "" }}</p>
    </div>
    <div>
      <label for="remarks"> remarks </label>
      <p>{{ show ? show.review.remarks : "" }}</p>
    </div>
  </div>
</template>
