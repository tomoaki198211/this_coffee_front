<script setup lang="ts">
import { RouterView } from "vue-router";
import GlobalNav from "./components/GlobalNav.vue";
import GlobalMessage from "./components/GlobalMessage.vue";
import FooterNav from "./components/FooterNav.vue";
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
  background: #ebdecc url("@/assets/bg.png") no-repeat center center;
  background-size: contain;
}
</style>
