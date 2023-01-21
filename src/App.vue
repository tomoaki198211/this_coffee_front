<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useMessageStore } from "./stores/message";
import GlobalNav from "./components/GlobalNav.vue";
import GlobalMessage from "./components/GlobalMessage.vue";

const authStore = useAuthStore();
const messageStore = useMessageStore();
</script>

<template>
  <div>
    <header>
      <h1>this_coffee!!</h1>
      <template v-if="authStore.uid !== ''">
        <p>ユーザー:{{ authStore.uid }}</p>
      </template>
      <GlobalNav />
    </header>
    <GlobalMessage />
    <RouterView />
  </div>
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
