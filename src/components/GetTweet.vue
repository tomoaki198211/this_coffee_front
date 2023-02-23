<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { mdiTwitter } from "@mdi/js";
import { useMessageStore } from "@/stores/message";
import { URL } from "../url";

interface Props {
  name: string;
}
const props = defineProps<Props>();
const tweets: any = ref([]);
const authStore = useAuthStore();
const messageStore = useMessageStore();
const isTweetButton = ref(false);

async function getTweet(): Promise<void> {
  isTweetButton.value = true;

  const config = {
    headers: {
      uid: authStore.uid,
      "access-token": authStore.access_token,
      client: authStore.client,
    },
  };
  const data = {
    tweet: {
      name: props.name,
    },
  };
  await axios
    .post(`${URL.ADDRESS}/api/v1/tweets/search`, data, config)
    .then((response) => {
      tweets.value = response.data;
      if (tweets.value == null) {
        messageStore.flash("直近7日間の検索結果はありません。", "red");
      }
    })
    .catch((error) => {
      messageStore.flash("検索結果がないか、取得出来ませんでした", "red");
    });
}
</script>

<template>
  <v-card>
    <template v-if="!isTweetButton">
      <v-btn
        @click="getTweet()"
        variant="text"
        :prepend-icon="mdiTwitter"
        :disabled="!authStore.isAuthencated()"
        >ツイッターで評判を見る</v-btn
      >
    </template>
    <template v-else>
      <v-card-title> 実行済みです。 </v-card-title>
    </template>
    <v-list>
      <v-list-item v-for="tweet in tweets" :key="tweet.id"
        >{{ tweet.text }}
        <v-divider></v-divider>
      </v-list-item>
    </v-list>
    <template v-if="isTweetButton && tweets === null">
      <v-card-title> 直近7日間の検索結果は0です。 </v-card-title>
    </template>
  </v-card>
</template>
