<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
// import{router}from "../router

const authStore = useAuthStore();
const router = useRouter();
// authStore.isAuthencated();
const onLogout = (): void => {
  const authStore = useAuthStore();
  authStore.logout();
  router.push({ name: "login" });
  // authStore.isAuthencated();
};
</script>

<template>
  <nav>
    <ul>
      <template v-if="!authStore.isAuthencated()">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/auth/login">ログイン</RouterLink></li>
        <li><RouterLink to="/auth/signup">アカウント新規登録</RouterLink></li>
      </template>
      <template v-else>
        <li><RouterLink to="/user">ユーザー情報</RouterLink></li>
        <li><RouterLink to="/reviews">レビュー一覧</RouterLink></li>
        <li><RouterLink to="/review/post">レビュー投稿</RouterLink></li>
        <li><RouterLink to="/recommendation">おすすめ</RouterLink></li>
        <li><a href="#" @click="onLogout">ログアウト</a></li>
      </template>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  text-align: center;
}
nav ul {
  margin: 0;
  padding: 0;
}
nav ul li {
  list-style: none;
  display: inline-block;
  width: 15%;
  min-width: 50px;
}
</style>
