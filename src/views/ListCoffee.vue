<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { usePageStore } from "../stores/page";
import axios from "axios";
import FavoriteButton from "../components/FavoriteButton.vue";
import { mdiMagnify } from "@mdi/js";
import { mdiCoffeeOutline } from "@mdi/js";
import { mdiHeart } from "@mdi/js";
import beans_img from "@/assets/image/beans.png";
import can_img from "@/assets/image/can.png";
import cappuccino_img from "@/assets/image/cappucino.png";
import float_img from "@/assets/image/float.png";
import hot_img from "@/assets/image/hot.png";
import ice_img from "@/assets/image/ice.png";
import instant_img from "@/assets/image/instant.png";

const authStore = useAuthStore();
const router = useRouter();
// const usePageStore = usePageStore();
const index = reactive({
  coffees: [],
});
const favorite = reactive({
  coffees: [],
});
const favorite_flg = ref(false);
const search_word = ref("");
const selected_category = reactive({
  id: "",
  name: "",
});
const selected_store = reactive({
  id: "",
  name: "",
});
const categories = ref([]);
const stores = ref([]);
const disabled_flg = ref(false);
const load = ref(false);
const page = ref(1);
const result = ref(1);
let itemsPerPage = ref(8);
const screenWidth = ref(window.innerWidth);
onMounted(() => {
  window.addEventListener("resize", resize);
});
const resize = () => {
  screenWidth.value = window.innerWidth;
  if (screenWidth.value > 1920) {
    itemsPerPage.value = 16;
  } else if (screenWidth.value > 1440) {
    itemsPerPage.value = 12;
  } else if (screenWidth.value > 1280) {
    itemsPerPage.value = 8;
  } else if (screenWidth.value > 960) {
    itemsPerPage.value = 6;
  } else if (screenWidth.value > 768) {
    itemsPerPage.value = 6;
  } else if (screenWidth.value > 600) {
    itemsPerPage.value = 6;
  } else if (screenWidth.value > 400) {
    itemsPerPage.value = 4;
  } else {
    itemsPerPage.value = 3;
  }
};

//front側で検索する際にcomputedを使用
const searchedCoffees = computed(() => {
  let coffees = [];
  for (let i in index.coffees) {
    let coffee = index.coffees[i];
    if (
      (coffee.coffee_property.name.indexOf(search_word.value) !== -1 ||
        search_word.value == "") &&
      (coffee.category.id === selected_category.id ||
        selected_category.id == "") &&
      (coffee.coffee_property.store.id === selected_store.id ||
        selected_store.id == "")
    ) {
      coffees.push(coffee);
    }
  }
  if (favorite_flg.value) {
    coffees = coffees.filter(
      (coffee) =>
        favorite.coffees.filter((favorite) => favorite.id === coffee.id)
          .length > 0
    );
  }
  getResult(coffees.length);
  coffees = coffees.slice(
    itemsPerPage.value * (page.value - 1),
    itemsPerPage.value * page.value
  );
  return coffees;
});
//---------

const getResult = (length) => {
  result.value = length;
};

const startListCoffee = () => {
  if (!authStore.isAuthencated()) {
    disabled_flg.value = true;
  }
};

const searchReset = () => {
  selected_category.id = "";
  selected_store.id = "";
  search_word.value = "";
};

const change_favorite = () => {
  favorite_flg.value = false;
};

const image_url = {
  5: beans_img,
  2: can_img,
  3: cappuccino_img,
  4: float_img,
  1: hot_img,
  6: ice_img,
  7: instant_img,
};

//apiで検索する際はwatchを使用
// watch(search_word, () => {
//   setSearch();
// });

// watch(selected_category, () => {
//   setSearch();
// });

// watch(selected_store, () => {
//   setSearch();
// });

//0マスター取得用
async function setMaster(): Promise<void> {
  await axios
    .get("/api/v1/coffees/option", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      categories.value = response.data.category;
      stores.value = response.data.store;
    });
}

//1 axios
async function setCoffee(): Promise<void> {
  await axios
    .get("/api/v1/coffees", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.coffees = response.data;
      load.value = true;
      console.log(response.data);
    });
}

async function favoriteCoffee(): Promise<void> {
  await axios
    .get("/api/v1/coffees/likes", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      favorite.coffees = response.data;
      favorite_flg.value = true;
      load.value = true;
      page.value = 1;
      console.log(favorite.coffees);
    });
}

// 2 axios 検索結果を表示する
async function setSearch(): Promise<void> {
  await axios
    .post("/api/v1/coffees/search", {
      search: {
        word: search_word.value,
        category: selected_category.id,
        store: selected_store.id,
      },
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.coffees = response.data;
      console.log(response.data);
    });
}

resize();
startListCoffee();
setCoffee();
setMaster();

// :src="`https://product.starbucks.co.jp${coffee.coffee_property.image}`"
</script>

<template>
  <div>
    <v-container fluid grid-list-xl class="w-100">
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="search_word"
            clearable
            label="商品名"
            variant="underlined"
            :prepend-icon="mdiMagnify"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="selected_category.id"
            :prepend-icon="mdiMagnify"
            label="分類"
            :hint="`${selected_category.id},${selected_category.name}`"
            :items="categories"
            item-title="name"
            item-value="id"
            variant="underlined"
            class="text-center"
          >
          </v-select>
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="selected_store.id"
            :prepend-icon="mdiMagnify"
            label="販売店"
            :hint="`${selected_store.id},${selected_store.name}`"
            :items="stores"
            item-title="name"
            item-value="id"
            variant="underlined"
            class="text-center"
          >
          </v-select>
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn
            icon
            color="#7b5544"
            variant="plain"
            class="ml-5"
            size="x-large"
            @click="searchReset()"
            ><p>検索リセット</p>
          </v-btn>
        </v-col>
      </v-row>
      <v-chip class="ma-2" color="#7b5544" variant="text" size="large"
        ><v-icon start :icon="mdiCoffeeOutline"></v-icon> コーヒー一覧画面
      </v-chip>
      <template v-if="authStore.isAuthencated()">
        <template v-if="favorite_flg">
          <v-btn
            class="mx-auto"
            @click="change_favorite()"
            variant="text"
            size="large"
            color="#7b5544"
          >
            <p class="ml-3">全体へ戻る</p>
          </v-btn>
        </template>
        <template v-else>
          <v-btn
            class="mx-auto"
            @click="favoriteCoffee()"
            variant="text"
            size="large"
            color="#7b5544"
          >
            <v-icon :icon="mdiHeart"></v-icon>
            <p class="ml-3">お気に入りのみ</p>
          </v-btn>
        </template>
      </template>
      <v-row>
        <v-col
          v-for="coffee in searchedCoffees"
          :key="coffee.id"
          cols="12"
          xs="1"
          sm="6"
          md="4"
          lg="3"
          xl="2"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              class="mx-auto"
              max-width="300"
              :elevation="isHovering ? 24 : 2"
              :class="{ 'on-hover': isHovering }"
              :color="isHovering ? '#d7ccc8' : 'undefined'"
              v-bind="props"
            >
              <v-img
                :src="`${image_url[coffee.category_id]}`"
                alt=""
                height="100"
              ></v-img>
              <div class="bg_color txt_white">
                <v-card-title class="text-body-1"
                  >{{ coffee.coffee_property.name }}
                </v-card-title>
                <v-card-subtitle class="text-body-1">
                  {{ coffee.coffee_property.store.name }}
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn
                    class="mx-auto"
                    :disabled="disabled_flg"
                    @click="
                      router.push({
                        path: `/review/post/${coffee.id}`,
                      })
                    "
                    >レビューを書く
                  </v-btn>
                  <v-btn class="mx-auto">詳細 </v-btn>
                  <FavoriteButton v-bind:coffee_id="coffee.id" />
                  <v-spacer></v-spacer>
                </v-card-actions>
              </div>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      <template
        v-if="
          index.coffees.length !== 0 && searchedCoffees == 0 && load == true
        "
      >
        <v-row justify="center" align="center">
          <p class="coffee_txt">
            検索結果がありません。<br />検索条件を変更して下さい。
          </p>
        </v-row>
      </template>
      <v-pagination
        v-model="page"
        :length="Math.ceil(result / itemsPerPage)"
        rounded="circle"
        class="mt-2"
        size="x-large"
      ></v-pagination>
    </v-container>
  </div>
</template>

<style scoped>
.coffee_txt {
  color: #7b5544;
}
.bg_color {
  background-color: #d7ccc8;
}
/* .txt_white {
  color: #7b5544;
} */
</style>
