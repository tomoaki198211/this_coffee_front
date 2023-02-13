<script setup lang="ts">
import { reactive } from "vue";
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
  <v-card class="mt-10 mb-8 mx-auto" max-width="400px">
    <v-container class="">
      <v-text-field
        :prepend-icon="mdiEmailOutline"
        v-model="user.email"
        label="Email"
        density="compact"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        :prepend-icon="mdiLockOutline"
        v-model="user.password"
        label="Password"
        density="compact"
        type="password"
        variant="outlined"
      ></v-text-field>
      <v-card-actions>
        <v-btn
          class="mx-auto"
          variant="flat"
          color="#7b5544"
          width="200px"
          @click="onLogin"
        >
          <p class="font-weight-bold btn-txt">ログイン</p>
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn
          class="mx-auto"
          variant="flat"
          color="#7b5544"
          width="200px"
          @click="guestLogin"
        >
          <p class="font-weight-bold btn-txt">ゲストログイン</p>
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn
          class="mx-auto"
          variant="flat"
          color="#7b5544"
          width="200px"
          @click="guestAdminLogin"
        >
          <p class="font-weight-bold btn-txt">ゲスト管理者ログイン</p>
        </v-btn>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<style scoped>
.btn-txt {
  color: white;
}
</style>
