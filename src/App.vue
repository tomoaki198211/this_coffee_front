<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useMessageStore } from "./stores/message";
import GlobalNav from "./components/GlobalNav.vue";
import GlobalMessage from "./components/GlobalMessage.vue";

const authStore = useAuthStore();
</script>

<template>
  <v-app>
    <div>
      <header>
        <GlobalNav />
      </header>
      <template v-if="authStore.uid !== ''">
        <p>ユーザー:{{ authStore.uid }}</p>
      </template>
      <GlobalMessage />
      <main>
        <RouterView />
      </main>
    </div>
  </v-app>
</template>

<style scoped></style>
