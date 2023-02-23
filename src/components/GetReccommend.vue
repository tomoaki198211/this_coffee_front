<script setup lang="ts">
import { ref, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useMessageStore } from "@/stores/message";
import moment from "moment";
import { useAuthStore } from "../stores/auth";
import { URL } from "../url";

const preference = ref(null);
const index: any = reactive({
  reviews: [],
});
const authStore = useAuthStore();
const messageStore = useMessageStore();
const router = useRouter();
//日付の修正
const momentDate = (date: any) => {
  return moment(date).format("YYYY/MM/DD");
};
const onpreferenceCoffeeStart = async () => {
  const config = {
    headers: {
      uid: authStore.uid,
      "access-token": authStore.access_token,
      client: authStore.client,
    },
  };
  const data = {
    review: {
      preference: preference.value,
    },
  };
  await axios
    .post(`${URL.ADDRESS}/api/v1/reviews/preference`, data, config)
    .then((response) => {
      index.reviews = response.data;
    })
    .catch((error) => {
      messageStore.flash(
        "取得出来ませんでした。好みをチェックして下さい",
        "red"
      );
    });
};
</script>

<template>
  <v-card class="mt-10 mb-8 mx-auto bg-color" max-width="400px">
    <v-card-title>好みからおすすめを探す</v-card-title>
    <v-card-subtitle>好みをチェックして下さい</v-card-subtitle>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6">
          <v-checkbox
            v-model="preference"
            label="風味"
            color="red"
            value="1"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="preference"
            label="甘み"
            color="red-darken-3"
            value="2"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="preference"
            label="苦味"
            color="orange"
            value="3"
            hide-details
          ></v-checkbox>
        </v-col>
        <v-col cols="12" sm="6">
          <v-checkbox
            v-model="preference"
            label="コク"
            color="indigo"
            value="4"
            hide-details
          ></v-checkbox>
          <v-checkbox
            v-model="preference"
            label="酸味"
            color="indigo-darken-3"
            value="5"
            hide-details
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-container>
    <template v-if="preference !== null">
      <v-btn
        class="mx-auto"
        block
        @click="onpreferenceCoffeeStart()"
        color="#d7ccc8"
        >おすすめを探す
      </v-btn>
    </template>
    <v-card-subtitle>選択した項目の評価の高いレビューを5件表示</v-card-subtitle>
    <v-list>
      <v-list-item
        v-for="review in index.reviews"
        :key="review.id"
        :title="review.coffee.coffee_property.name"
      >
        {{ momentDate(review.created_at) }}:投稿者:{{ review.user.name }}
        <v-btn
          @click="router.push({ path: `/review/${review.id}` })"
          variant="text"
          >レビューを見る</v-btn
        >
        <v-divider></v-divider>
      </v-list-item>
    </v-list>
  </v-card>
</template>
