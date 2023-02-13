<script setup lang="ts">
import { ref, reactive } from "vue";
import axios, { type AxiosResponse } from "axios";
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
const messageStore = useMessageStore();
const router = useRouter();

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

setUser();

async function setUser(): Promise<void> {
  await axios
    .get(`http://localhost:3000/api/v1/admin/users/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      console.log(response.data);
      user.name = response.data.user.name;
      user.email = response.data.user.email;
    });
}
async function updateUser(): Promise<void> {
  await axios
    .put(`http://localhost:3000/api/v1/admin/users/${props.id}`, {
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
      authStore.flase("更新しました");
    });
}
async function destroyUser(): Promise<void> {
  await axios
    .delete(`http://localhost:3000/api/v1/admin/users/${props.id}`, {
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
            <v-card-actions>
              <v-btn
                class="mx-auto"
                variant="flat"
                color="#7b5544"
                width="110px"
                @click="updateUser()"
                ><p class="font-weight-bold btn-txt">更新</p>
              </v-btn>
              <v-btn
                class="mx-auto"
                variant="flat"
                color="red"
                width="110px"
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
