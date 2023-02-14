<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useMessageStore } from "@/stores/message";
import { useRouter } from "vue-router";
import { mdiArrowLeftThick } from "@mdi/js";
import { mdiEmailOutline } from "@mdi/js";
import { mdiLockOutline } from "@mdi/js";

interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const router = useRouter();
const disabled_flg = ref(true);
type userSignObj = {
  name: string;
  email: string;
  password: string;
};

const user: userSignObj = reactive({
  name: authStore.user_name,
  email: authStore.uid,
  password: "",
});

const onAccountUpdate = (): void => {
  const authStore = useAuthStore();
  const name = user.name;
  const email = user.email;
  const password = user.password;
  authStore.account_update(email, password, name);
};
const onAccountDestroy = (): void => {
  const authStore = useAuthStore();
  authStore.sign_out();
};
const onEdit = () => {
  disabled_flg.value = false;
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
          v-bind:readonly="disabled_flg"
        ></v-text-field>
        <v-text-field
          :prepend-icon="mdiEmailOutline"
          v-model="user.email"
          label="Email"
          density="compact"
          variant="outlined"
          v-bind:readonly="disabled_flg"
        ></v-text-field>
        <v-text-field
          :prepend-icon="mdiLockOutline"
          v-model="user.password"
          label="Password"
          density="compact"
          type="password"
          variant="outlined"
          v-bind:readonly="disabled_flg"
        ></v-text-field>
        <v-card-actions>
          <template v-if="disabled_flg == true">
            <v-btn
              class="mx-auto"
              variant="flat"
              color="#7b5544"
              width="200px"
              @click="onEdit()"
              ><p class="font-weight-bold btn-txt">編集</p>
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              class="mx-auto"
              variant="flat"
              color="#7b5544"
              width="110px"
              @click="onAccountUpdate()"
              ><p class="font-weight-bold btn-txt">更新</p>
            </v-btn>
            <v-btn
              class="mx-auto"
              variant="flat"
              color="red"
              width="110px"
              @click="onAccountDestroy()"
              ><p class="font-weight-bold btn-txt">アカウント削除</p>
            </v-btn>
          </template>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-container>
</template>
<style scoped>
.btn-txt {
  color: #ffff;
}
</style>
