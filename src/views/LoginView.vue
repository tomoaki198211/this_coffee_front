<script setup lang="ts">
import { reactive, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { mdiEmailOutline } from "@mdi/js";
import { mdiLockOutline } from "@mdi/js";

type userLoginObj = {
  email: string;
  password: string;
};

const user: userLoginObj = reactive({
  email: "",
  password: "",
});

const authStore = useAuthStore();

const onLogin = (): void => {
  const authStore = useAuthStore();
  const email = user.email;
  const password = user.password;
  authStore.login(email, password);
  user.email = "";
  user.password = "";
};

const guestLogin = (): void => {
  authStore.guest_login();
};

const guestAdminLogin = (): void => {
  authStore.guest_admin_login();
};
</script>
<template>
  <div>
    <div>
      <label for="email"> Email </label>
      <v-text-field
        v-model="user.email"
        density="compact"
        placeholder=" Email"
        variant="outlined"
      >
        <v-icon :icon="mdiEmailOutline"></v-icon
      ></v-text-field>
    </div>
    <div>
      <label for="password"> Password </label>
      <v-text-field
        v-model="user.password"
        placeholder=" ******************"
        variant="outlined"
        ><v-icon :icon="mdiLockOutline"></v-icon
      ></v-text-field>
    </div>
    <div>
      <v-btn @click="onLogin">ログイン</v-btn>
      <v-btn @click="guestLogin">ゲストログイン</v-btn>
      <v-btn @click="guestAdminLogin">ゲスト管理者ログイン</v-btn>
    </div>
  </div>
</template>
