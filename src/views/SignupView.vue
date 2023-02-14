<script setup lang="ts">
import { reactive, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { mdiEmailOutline } from "@mdi/js";
import { mdiLockOutline } from "@mdi/js";

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
      <v-container class="">
        <v-text-field
          :prepend-icon="mdiEmailOutline"
          v-model="user.name"
          label="Name"
          density="compact"
          variant="outlined"
        ></v-text-field>
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
        <v-text-field
          :prepend-icon="mdiLockOutline"
          v-model="user.password_confirmation"
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
            @click="onSignup()"
            ><p class="font-weight-bold btn-txt">新規登録</p>
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
