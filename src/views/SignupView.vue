<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useMessageStore } from "@/stores/message";
import { mdiEmailOutline } from "@mdi/js";
import { mdiLockOutline } from "@mdi/js";
import { mdiAccountPlus } from "@mdi/js";

type User = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const user: User = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});
const router = useRouter();
const messageStore = useMessageStore();
const valid = ref("true");
const form = ref();
const requiredValidation = (value) => !!value || "必須項目です";
const emailValidation = (value) =>
  value.match(
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
  ) || "有効なEメールを入力して下さい";

const form_validate = async () => {
  const validResult = await form.value.validate();
  if (validResult.valid) {
    valid.value = true;
    onSignup();
  } else {
    messageStore.flash("必須項目を入力して下さい", "red");
    valid.value = false;
  }
};

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
        新規登録画面
      </v-chip>
      <v-container class="">
        <v-form ref="form">
          <v-text-field
            :prepend-icon="mdiEmailOutline"
            v-model="user.name"
            :rules="[requiredValidation]"
            label="名前"
            density="compact"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            :prepend-icon="mdiEmailOutline"
            v-model="user.email"
            :rules="[requiredValidation, emailValidation]"
            label="Eメール"
            density="compact"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            :prepend-icon="mdiLockOutline"
            v-model="user.password"
            :rules="[requiredValidation]"
            label="パスワード"
            density="compact"
            type="password"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            :prepend-icon="mdiLockOutline"
            v-model="user.password_confirmation"
            :rules="[requiredValidation]"
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
              @click="form_validate()"
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
        </v-form>
      </v-container>
    </v-card>
  </v-container>
</template>

<style scoped>
.btn-txt {
  color: white;
}
</style>
