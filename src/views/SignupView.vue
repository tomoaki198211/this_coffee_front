<script setup lang="ts">
import { reactive, computed } from "vue";
import { useAuthStore } from "../stores/auth";

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

const authStore = useAuthStore();
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
  <div>
    <div>
      <label for="name"> Name </label>
      <input v-model="user.name" id="Name" type="text" placeholder="Name" />
    </div>
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
    <div>
      <label for="password_confirmation"> Password確認 </label>
      <input
        v-model="user.password_confirmation"
        id="password_confirmation"
        type="password"
        placeholder="******************"
      />
    </div>
    <button @click="onSignup()">Sign up</button>
  </div>
</template>
