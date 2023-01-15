<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <h1>this_coffee!!</h1>
    <nav>
      <ul>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/login">ログイン</RouterLink></li>
        <li><RouterLink to="/signup">アカウント登録</RouterLink></li>
      </ul>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  height: 100px;
  background-color: bisque;
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
  width: 18%;
  min-width: 90px;
}
</style>
