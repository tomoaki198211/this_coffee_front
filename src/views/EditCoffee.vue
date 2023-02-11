<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import axios, { type AxiosResponse } from "axios";

interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const router = useRouter();

async function showCoffee(): Promise<void> {
  await axios
    .get(`http://localhost:3000/api/v1/coffees/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      prop_name.value = response.data;
      console.log(response.data);
    });
}
</script>
<template>
  <v-container>
    <v-card class="mx-auto w-75">
      <v-img src="" alt="" height="150" cover></v-img>
      <v-card-title>
        <v-text-field
          v-model="firstname"
          :rules="nameRules"
          :counter="10"
          label="First name"
          required
        ></v-text-field>
      </v-card-title>
      <v-list-item>
        <v-list-item-title>うむ</v-list-item-title>
        <v-list-item-subtitle></v-list-item-subtitle>
      </v-list-item>
      <v-card-actions>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
