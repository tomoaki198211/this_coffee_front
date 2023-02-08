<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useMessageStore } from "./stores/message";
import GlobalNav from "./components/GlobalNav.vue";
import GlobalMessage from "./components/GlobalMessage.vue";
import FooterNav from "./components/FooterNav.vue";

const authStore = useAuthStore();
</script>

<template>
  <v-app class="top">
    <GlobalNav />
    <v-main class="wrapper">
      <GlobalMessage />
      <RouterView />
    </v-main>
    <FooterNav />
  </v-app>
</template>

<style scoped>
.wrapper {
  width: 100%;
  padding-bottom: 50px;
}
.top {
  background: #ebdecc url("@/assets/bg-2.png") no-repeat center center;
  background-size: contain;
}
</style>
