<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import axios, { type AxiosResponse } from "axios";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const index = reactive({
  users: [],
});
setUser();

async function setUser(): Promise<void> {
  await axios
    .get("http://localhost:3000/api/v1/admin/users", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.users = response.data;
      console.log(response.data);
    });
}
</script>

<template>
  <div>
    <ul>
      <li v-for="user in index.users" :key="user.id">
        名前:{{ user.name }}<br />
        email:{{ user.email }}<br />
        admin権限:{{ user.admin }}
      </li>
    </ul>
  </div>
</template>
