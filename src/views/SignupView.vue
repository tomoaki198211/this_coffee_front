<script setup lang="ts">
import { reactive, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { mdiEmailOutline } from "@mdi/js";
import { mdiLockOutline } from "@mdi/js";
import { mdiAccountPlus } from "@mdi/js";

type userSignObj = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const user: userSignObj = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});
const router = useRouter();

const onSignup = (): void => {
  const authStore = useAuthStore();
  const name = user.name;
  const email = user.email;
  const password = user.password;
  const password_confirmation = user.password_confirmation;
  authStore.signup(email, password, password_confirmation, name);
};
</script>

<template>
  <v-container>
    <v-card class="mt-10 mb-8 mx-auto" max-width="400px">
      <v-chip class="ma-2" color="#7b5544" variant="text" size="large"
        ><v-icon start :icon="mdiAccountPlus"></v-icon>
        ログイン画面
      </v-chip>
      <v-container class="">
        <v-text-field
          :prepend-icon="mdiEmailOutline"
          v-model="user.name"
          label="名前"
          density="compact"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          :prepend-icon="mdiEmailOutline"
          v-model="user.email"
          label="Eメール"
          density="compact"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          :prepend-icon="mdiLockOutline"
          v-model="user.password"
          label="パスワード"
          density="compact"
          type="password"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          :prepend-icon="mdiLockOutline"
          v-model="user.password_confirmation"
          label="パスワード確認"
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
            @click="onSignup()"
            ><p class="font-weight-bold btn-txt">新規登録</p>
          </v-btn>
        </v-card-actions>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            class="mx-auto"
            variant="text"
            color="#7b5544"
            @click="router.push('/auth/login')"
          >
            既にアカウントがある場合はこちら
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn
            class="mx-auto"
            variant="text"
            color="#7b5544"
            @click="router.push('/reviews')"
          >
            ログインせずにレビューを見る
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-container>
</template>

<style scoped>
.btn-txt {
  color: white;
}
</style>
