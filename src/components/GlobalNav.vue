<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { mdiAccountPlus } from "@mdi/js";
import { mdiHome } from "@mdi/js";
import { mdiLogin } from "@mdi/js";
import { mdiLogout } from "@mdi/js";
import { mdiCoffee } from "@mdi/js";
import { mdiComment } from "@mdi/js";
import { mdiDatabaseEdit } from "@mdi/js";
import { mdiAccountCircleOutline } from "@mdi/js";

const drawer = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const onLogout = (): void => {
  const authStore = useAuthStore();
  authStore.logout();
  router.push("/");
};
</script>

<template>
  <v-app-bar :elevation="2" color="#7b5544">
    <v-app-bar-title><p class="title">this Coffee!</p></v-app-bar-title>
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="drawer = !drawer"
      color="white"
    ></v-app-bar-nav-icon>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" location="right" temporary>
    <template v-if="!authStore.isAuthencated()">
      <v-list>
        <v-btn variant="plain" @click="router.push('/')">
          <v-icon :icon="mdiHome"></v-icon>ホーム
        </v-btn>
      </v-list>
      <v-list>
        <v-btn variant="plain" @click="router.push('/reviews')">
          <v-icon :icon="mdiComment"></v-icon>レビュー
        </v-btn>
      </v-list>
      <v-list>
        <v-btn variant="plain" @click="router.push('/coffees')">
          <v-icon :icon="mdiCoffee"></v-icon>コーヒー
        </v-btn>
      </v-list>
      <v-list>
        <v-btn variant="plain" @click="router.push('/auth/login')">
          <v-icon :icon="mdiLogin"></v-icon>ログイン
        </v-btn>
      </v-list>
      <v-list>
        <v-btn variant="plain" @click="router.push('/auth/signup')">
          <v-icon :icon="mdiAccountPlus"></v-icon>新規登録
        </v-btn>
      </v-list>
    </template>
    <template v-else>
      <v-list>
        <v-btn variant="plain" @click="router.push('/reviews')">
          <v-icon :icon="mdiComment"></v-icon>レビュー
        </v-btn>
      </v-list>
      <v-list>
        <v-btn variant="plain" @click="router.push('/coffees')">
          <v-icon :icon="mdiCoffee"></v-icon>コーヒー
        </v-btn>
      </v-list>
      <v-list>
        <v-btn variant="plain" @click="router.push('/auth/account')">
          <v-icon :icon="mdiAccountCircleOutline"></v-icon>アカウント
        </v-btn>
      </v-list>
      <v-list>
        <v-btn variant="plain" @click="onLogout()">
          <v-icon :icon="mdiLogout"></v-icon>ログアウト
        </v-btn>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-btn variant="plain" @click="router.push('/coffees/admin/index')">
          <v-icon :icon="mdiDatabaseEdit"></v-icon>マスタ管理
        </v-btn>
      </v-list>
      <v-list>
        <v-btn variant="plain" @click="router.push('/users/admin/index')">
          <v-icon :icon="mdiDatabaseEdit"></v-icon>ユーザー管理
        </v-btn>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <p class="ml-3 overflow-x-auto">{{ authStore.user_name }}</p>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.title {
  color: white;
}
</style>
