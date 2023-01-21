<script setup lang="ts">
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

type userLoginObj = {
  email: string;
  password: string;
};

const user: userLoginObj = reactive({
  email: "",
  password: "",
});

const router = useRouter();
const authStore = useAuthStore();

const onLogin = (): void => {
  const authStore = useAuthStore();
  const email = user.email;
  const password = user.password;
  authStore.login(email, password);
  user.email = "";
  user.password = "";
  router.push({ name: "reviews" });
};
</script>
<template>
  <div>
    <div>
      <label for="email"> Email </label>
      <input v-model="user.email" id="Email" type="text" placeholder="Email" />
    </div>
    <div>
      <label for="password"> Password </label>
      <input
        v-model="user.password"
        id="password"
        type="password"
        placeholder="******************"
      />
    </div>
    <button @click="onLogin">ログイン</button>
  </div>
</template>
