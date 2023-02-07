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
  <v-app>
    <GlobalNav />
    <v-main>
      <GlobalMessage />
      <RouterView />
    </v-main>
    <FooterNav />
  </v-app>
</template>

<style scoped></style>
