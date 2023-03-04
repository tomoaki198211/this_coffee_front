<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useMessageStore } from "@/stores/message";
import { mdiEmailOutline } from "@mdi/js";
import { mdiLockOutline } from "@mdi/js";
import { mdiLogin } from "@mdi/js";

const user = reactive({
  email: "",
  password: "",
});
const authStore = useAuthStore();
const router = useRouter();
const messageStore = useMessageStore();
const valid = ref(true);
const form = ref();
const requiredValidation = (value: boolean) => !!value || "必須項目です";
const emailValidation = (value: any) =>
  value.match(
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
  ) || "有効なEメールを入力して下さい";

const form_validate = async () => {
  const validResult = await form.value.validate();
  if (validResult.valid) {
    valid.value = true;
    onLogin();
  } else {
    messageStore.flash("必須項目を入力して下さい", "red");
    valid.value = false;
  }
};

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
  <v-container>
    <v-card class="mt-10 mb-8 mx-auto" max-width="400px">
      <v-chip class="ma-2" color="#7b5544" variant="text" size="large"
        ><v-icon start :icon="mdiLogin"></v-icon>
        ログイン画面
      </v-chip>
      <v-container class="">
        <v-form ref="form">
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
          <v-card-actions>
            <v-btn
              class="mx-auto"
              variant="flat"
              color="#7b5544"
              width="200px"
              @click="form_validate()"
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
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              class="mx-auto"
              variant="text"
              color="#7b5544"
              @click="router.push('/auth/signup')"
            >
              新規登録する場合はこちら
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
