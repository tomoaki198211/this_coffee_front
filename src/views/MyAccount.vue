<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import { mdiAccountCircleOutline } from "@mdi/js";
import { mdiEmailOutline } from "@mdi/js";
import { mdiLockOutline } from "@mdi/js";
import Image from "../components/CoffeeImage.vue";
import GetReccommend from "../components/GetReccommend.vue";
import { URL } from "../url";

const authStore = useAuthStore();
const disabled_flg = ref(true);
const coffee = ref();
const shuffled = ref(false);
const isShuffle = ref(false);
const user: any = reactive({
  name: authStore.user_name,
  email: authStore.uid,
  password: "",
});
const index: any = reactive({
  coffees: [],
});
const onShuffleStart: any = () => {
  if (index.coffees.length === 0) {
    setCoffee();
  }
  isShuffle.value = true;
  shuffled.value = false;
};

const onShuffleStop: any = () => {
  coffee.value =
    index.coffees[Math.floor(Math.random() * index.coffees.length)];
  isShuffle.value = false;
  shuffled.value = true;
};

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
const onShow = () => {
  disabled_flg.value = true;
  user.name = authStore.user_name;
  user.email = authStore.uid;
};

async function setCoffee(): Promise<void> {
  await axios
    .get(`${URL.ADDRESS}/api/v1/coffees`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.coffees = response.data;
    });
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card class="mt-10 mb-8 mx-auto" max-width="400px">
          <v-chip class="ma-2" color="#7b5544" variant="text" size="large"
            ><v-icon start :icon="mdiAccountCircleOutline"></v-icon>
            アカウント管理画面
          </v-chip>
          <v-container class="">
            <v-text-field
              :prepend-icon="mdiEmailOutline"
              v-model="user.name"
              label="名前"
              density="compact"
              variant="outlined"
              v-bind:readonly="disabled_flg"
            ></v-text-field>
            <v-text-field
              :prepend-icon="mdiEmailOutline"
              v-model="user.email"
              label="Eメール"
              density="compact"
              variant="outlined"
              v-bind:readonly="disabled_flg"
            ></v-text-field>
            <v-text-field
              :prepend-icon="mdiLockOutline"
              v-model="user.password"
              label="パスワード"
              density="compact"
              type="password"
              variant="outlined"
              v-bind:readonly="disabled_flg"
            ></v-text-field>
            <template v-if="disabled_flg == true">
              <v-card-actions>
                <v-btn
                  block
                  class="mx-auto"
                  variant="flat"
                  color="#7b5544"
                  @click="onEdit()"
                  ><p class="font-weight-bold btn-txt">アカウント編集</p>
                </v-btn>
              </v-card-actions>
            </template>
            <template v-else>
              <v-card-actions>
                <v-btn
                  block
                  class="mx-auto"
                  variant="flat"
                  color="#7b5544"
                  @click="onShow()"
                  ><p class="font-weight-bold btn-txt">編集取り消し</p>
                </v-btn>
              </v-card-actions>
              <v-card-actions>
                <v-btn
                  block
                  class="mx-auto"
                  variant="flat"
                  color="#7b5544"
                  @click="onAccountUpdate()"
                  ><p class="font-weight-bold btn-txt">アカウント更新</p>
                </v-btn>
              </v-card-actions>
              <v-card-actions>
                <v-btn
                  block
                  class="mx-auto"
                  variant="flat"
                  color="red"
                  @click="onAccountDestroy()"
                  ><p class="font-weight-bold btn-txt">アカウント削除</p>
                </v-btn>
              </v-card-actions>
            </template>
          </v-container>
        </v-card>
        <v-card class="mt-10 mb-8 mx-auto bg-color" max-width="400px">
          <v-card-title>今日の一杯</v-card-title>
          <v-card class="mx-auto mb-8" max-width="300">
            <template v-if="shuffled">
              <Image v-bind:id="coffee.category_id" v-bind:height="100" />
              <div class="bg_color txt_white">
                <v-card-item>
                  <v-card-title class="text-body-1">
                    {{ coffee ? coffee.coffee_property.name : "" }}
                  </v-card-title>
                  <v-card-subtitle class="text-body-1">
                    {{ coffee ? coffee.coffee_property.store.name : "" }}
                  </v-card-subtitle>
                </v-card-item>
              </div>
            </template>
            <template v-else>
              <template v-if="isShuffle">
                <div class="text-center">
                  <v-card-subtitle>今日の一杯を探しています</v-card-subtitle>
                  <v-progress-linear
                    color="deep-purple-accent-4"
                    indeterminate
                    rounded
                    height="6"
                  ></v-progress-linear>
                </div>
              </template>
            </template>
          </v-card>
          <tempalete v-if="!isShuffle">
            <v-btn
              class="mx-auto"
              block
              @click="onShuffleStart()"
              color="#d7ccc8"
              >今日の一杯を探す(ランダムで選択されます)
            </v-btn>
          </tempalete>
          <tempalete v-else>
            <v-btn
              class="mx-auto"
              block
              @click="onShuffleStop()"
              color="#d7ccc8"
              >結果を見る
            </v-btn>
          </tempalete>
        </v-card>
      </v-col>
      <v-col sm="6">
        <GetReccommend />
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.btn-txt {
  color: #ffff;
}
.bg_color {
  background-color: #d7ccc8;
}
</style>
