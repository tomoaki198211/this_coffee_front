<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { mdiTwitter } from "@mdi/js";
import { useMessageStore } from "@/stores/message";

interface Props {
  name: string;
}
const props = defineProps<Props>();
const tweets: any = ref([]);
const authStore = useAuthStore();
const messageStore = useMessageStore();

async function getTweet(): Promise<void> {
  tweets.value.length = 0;
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
    .post("/api/v1/tweets/search", data, config)
    .then((response) => {
      tweets.value = response.data;
      if (tweets.value.length == 0) {
        messageStore.flash("検索結果はありません。");
      }
    })
    .catch((error) => {
      messageStore.flash("検索結果がないか、取得出来ませんでした");
    });
}
</script>

<template>
  <v-card>
    <v-btn
      @click="getTweet()"
      variant="text"
      :prepend-icon="mdiTwitter"
      :disabled="!authStore.isAuthencated()"
      >ツイッターで評判を見る</v-btn
    >
    <v-list>
      <v-list-item v-for="tweet in tweets" :key="tweet.id"
        >{{ tweet.text }}
        <v-divider></v-divider>
      </v-list-item>
    </v-list>
  </v-card>
</template>
