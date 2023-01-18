<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import GlobalNav from "@/components/GlobalNav.vue";

const authStore = useAuthStore();
</script>

<template>
  <header>
    <h1>this_coffee!!</h1>
    <div v-if="authStore.uid !== ''">
      <p>ユーザー:{{ authStore.uid }}</p>
    </div>
    <GlobalNav />
    <!-- <nav>
      <ul>
        <template v-if="authStore.uid == ''">
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/auth/login">ログイン</RouterLink></li>
          <li><RouterLink to="/auth/signup">アカウント新規登録</RouterLink></li>
        </template>
        <template v-else>
          <li><RouterLink to="/user">ユーザー情報</RouterLink></li>
          <li><RouterLink to="/reviews">レビュー一覧</RouterLink></li>
          <li><RouterLink to="/review/post">レビュー投稿</RouterLink></li>
          <li><RouterLink to="/recommendation">おすすめ</RouterLink></li>
          <li><RouterLink to="/auth/login">ログイン</RouterLink></li>
        </template>
      </ul>
    </nav> -->
  </header>
  <main>
    {{ authStore.message }}
    <RouterView></RouterView>
  </main>
</template>

<style scoped>
header {
  height: 100px;
  background-color: rgb(220, 204, 212);
}
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
