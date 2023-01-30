<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useMessageStore } from "@/stores/message";
import axios from "axios";

interface Props {
  coffee_id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const favorites = reactive({
  list: [],
});
const count = computed((): number => {
  return favorites.list.length;
});
const messageStore = useMessageStore();

setFavorite();

//お気に入りをしているかどうか
const isFavorited = computed((): Boolean => {
  if (favorites.list.length === 0) {
    return false;
  }
  return Boolean(findFavoriteId());
});

//idを探す
const findFavoriteId = () => {
  const favorite = favorites.list.find((favorite) => {
    return favorite.user_id === Number(authStore.user_id);
  });
  if (favorite) {
    return favorite.id;
  }
};

//お気に入り一覧を取得する
async function setFavorite(): Promise<void> {
  const config = {
    headers: {
      uid: authStore.uid,
      "access-token": authStore.access_token,
      client: authStore.client,
    },
  };
  await axios
    .get(
      `http://localhost:3000/api/v1/coffees/${props.coffee_id}/favorites`,
      {},
      config
    )
    .then((response) => {
      console.log(response.data);
      favorites.list = response.data;
    });
}

//お気に入り登録
async function registerFavorite(): Promise<void> {
  const data = {
    favorite: {
      coffee_id: props.coffee_id,
    },
  };
  const config = {
    headers: {
      uid: authStore.uid,
      "access-token": authStore.access_token,
      client: authStore.client,
    },
  };
  await axios
    .post(
      `http://localhost:3000/api/v1/coffees/${props.coffee_id}/favorites`,
      data,
      config
    )
    .then((response) => {
      console.log(response.data);
      favorites.list = response.data;
      messageStore.flash("お気に入りしました");
      setFavorite();
    });
}

//お気に入り解除
async function deleteFavorite(): Promise<void> {
  const favoriteid = findFavoriteId();
  await axios
    .delete(
      `http://localhost:3000/api/v1/coffees/${props.coffee_id}/favorites/${favoriteid}`,
      {
        headers: {
          uid: authStore.uid,
          "access-token": authStore.access_token,
          client: authStore.client,
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      messageStore.flash("お気に入りを解除しました");
      setFavorite();
    });
}
</script>

<template>
  <button v-if="isFavorited" @click="deleteFavorite()">
    お気に入りを取り消す
  </button>
  <button v-else @click="registerFavorite()">お気に入りする</button>
  {{ count }}
</template>