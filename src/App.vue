<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useMessageStore } from "./stores/message";
import GlobalNav from "./components/GlobalNav.vue";
import GlobalMessage from "./components/GlobalMessage.vue";
import WaveCoffee from "./components/WaveCoffee.vue";

const authStore = useAuthStore();
</script>

<template>
  <v-app>
    <GlobalNav />
    <GlobalMessage />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
  <!-- <WaveCoffee /> -->
</template>

<style scoped></style>
