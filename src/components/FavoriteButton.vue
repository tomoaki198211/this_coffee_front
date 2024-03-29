<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useMessageStore } from "@/stores/message";
import axios from "axios";
import { mdiHeart } from "@mdi/js";
import { mdiHeartOutline } from "@mdi/js";
import { URL } from "../url";

interface Props {
  coffee_id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const favorites: any = reactive({
  list: [],
});
const count = computed((): number => {
  return favorites.list.length;
});
const messageStore = useMessageStore();
const disabled_flg = ref(false);
const startFavorites = () => {
  if (!authStore.isAuthencated()) {
    disabled_flg.value = true;
  }
};

const isFavorited = computed((): Boolean => {
  if (favorites.list.length === 0) {
    return false;
  }
  return Boolean(findFavoriteId());
});

const findFavoriteId = () => {
  const favorite = favorites.list.find((favorite: any) => {
    return favorite.user_id === Number(authStore.user_id);
  });
  if (favorite) {
    return favorite.id;
  }
};

async function setFavorite(): Promise<void> {
  const config = {
    headers: {
      uid: authStore.uid,
      "access-token": authStore.access_token,
      client: authStore.client,
    },
  };
  await axios
    .get(`${URL.ADDRESS}/api/v1/coffees/${props.coffee_id}/favorites`, config)
    .then((response) => {
      favorites.list = response.data;
    });
}

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
      `${URL.ADDRESS}/api/v1/coffees/${props.coffee_id}/favorites`,
      data,
      config
    )
    .then((response) => {
      favorites.list = response.data;
      messageStore.flash("お気に入りしました");
      setFavorite();
    })
    .catch((error) => {
      messageStore.flash("お気に入り出来ませんでした", "red");
    });
}

async function deleteFavorite(): Promise<void> {
  const favoriteid = findFavoriteId();
  await axios
    .delete(
      `${URL.ADDRESS}/api/v1/coffees/${props.coffee_id}/favorites/${favoriteid}`,
      {
        headers: {
          uid: authStore.uid,
          "access-token": authStore.access_token,
          client: authStore.client,
        },
      }
    )
    .then((response) => {
      messageStore.flash("お気に入りを解除しました");
      setFavorite();
    })
    .catch((error) => {
      messageStore.flash("お気に入りを解除出来ませんでした", "red");
    });
}

startFavorites();
setFavorite();
</script>

<template>
  <v-btn
    class="mx-auto"
    v-if="isFavorited"
    @click="deleteFavorite()"
    :disabled="disabled_flg"
  >
    <v-icon :icon="mdiHeart"></v-icon>
    <p class="ml-3">{{ count }}</p>
  </v-btn>
  <v-btn
    class="mx-auto"
    v-else
    @click="registerFavorite()"
    :disabled="disabled_flg"
  >
    <v-icon :icon="mdiHeartOutline"></v-icon>
    <p class="ml-3">{{ count }}</p>
  </v-btn>
</template>
