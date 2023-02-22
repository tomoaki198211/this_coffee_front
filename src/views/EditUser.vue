<script setup lang="ts">
import { reactive } from "vue";
import axios, { type AxiosResponse } from "axios";
import { useAuthStore } from "../stores/auth";
import { useMessageStore } from "@/stores/message";
import { useRouter } from "vue-router";
import { mdiArrowLeftThick } from "@mdi/js";
import { mdiEmailOutline } from "@mdi/js";
import { mdiLockOutline } from "@mdi/js";
import { mdiAccountSupervisorOutline } from "@mdi/js";
import { URL } from "../url";

interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const messageStore = useMessageStore();
const router = useRouter();

const user = reactive({
  name: authStore.user_name,
  email: authStore.uid,
  password: "",
});

setUser();

async function setUser(): Promise<void> {
  await axios
    .get(`${URL.ADDRESS}/api/v1/admin/users/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      user.name = response.data.user.name;
      user.email = response.data.user.email;
    });
}
async function updateUser(): Promise<void> {
  await axios
    .put(`${URL.ADDRESS}/api/v1/admin/users/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
      name: user.name,
      email: user.email,
      password: user.password,
    })
    .then(() => {
      messageStore.flash("更新しました");
    });
}
async function destroyUser(): Promise<void> {
  await axios
    .delete(`${URL.ADDRESS}/api/v1/admin/users/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then(() => {
      messageStore.flash("削除しました");
      router.push("/users/admin/index");
    });
}
</script>

<template>
  <v-container>
    <v-row width="100%">
      <v-col cols="12" sm="1">
        <v-btn
          color="#7b5544"
          variant="plain"
          class="mx-auto"
          size="large"
          icon
          @click="router.push('/users/admin/index')"
          ><v-icon :icon="mdiArrowLeftThick" size="large"> </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" sm="11">
        <v-card class="mt-10 mb-8 mx-auto" max-width="400px">
          <v-chip class="ma-2" color="#7b5544" variant="text" size="large"
            ><v-icon start :icon="mdiAccountSupervisorOutline"></v-icon>
            ユーザー編集画面
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
            <v-card-actions>
              <v-btn
                class="mx-auto"
                variant="flat"
                color="#7b5544"
                block
                @click="updateUser()"
                ><p class="font-weight-bold btn-txt">更新</p>
              </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn
                class="mx-auto"
                variant="flat"
                color="red"
                block
                @click="destroyUser()"
                ><p class="font-weight-bold btn-txt">アカウント削除</p>
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.btn-txt {
  color: #ffff;
}
</style>
