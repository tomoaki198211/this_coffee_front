<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { mdiAccountPlus } from "@mdi/js";
import { mdiHome } from "@mdi/js";
import { mdiLogin } from "@mdi/js";
import { mdiLogout } from "@mdi/js";
import { mdiCoffee } from "@mdi/js";
import { mdiComment } from "@mdi/js";

const authStore = useAuthStore();
const router = useRouter();

const onLogout = (): void => {
  const authStore = useAuthStore();
  authStore.logout();
  router.push({ name: "login" });
};
</script>

<template>
  <v-app-bar :elevation="2">
    <v-app-bar-title>this Coffee!</v-app-bar-title>
    <v-row justify="space-around">
      <template v-if="!authStore.isAuthencated()">
        <v-btn size="small" icon @click="router.push('/')">
          <v-icon :icon="mdiHome"></v-icon>home
        </v-btn>
        <v-btn size="small" icon @click="router.push('/auth/login')">
          <v-icon :icon="mdiLogin"></v-icon>login
        </v-btn>
        <v-btn size="small" icon @click="router.push('/auth/signup')">
          <v-icon :icon="mdiAccountPlus"></v-icon>sign
        </v-btn>
      </template>
      <template v-else>
        <!-- <li><RouterLink to="/user">ユーザー情報</RouterLink></li> -->
        <v-btn size="small" icon @click="router.push('/reviews')">
          <v-icon :icon="mdiComment"></v-icon>review
        </v-btn>
        <v-btn size="small" icon @click="router.push('/coffees')">
          <v-icon :icon="mdiCoffee"></v-icon>coffee
        </v-btn>
        <v-btn size="small" icon @click="onLogout()">
          <v-icon :icon="mdiLogout"></v-icon>logout
        </v-btn>
        <RouterLink to="/recommendation">おすすめ</RouterLink>
      </template>
    </v-row>
  </v-app-bar>
</template>

<style scoped></style>
