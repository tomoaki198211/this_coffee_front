<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { usePageStore } from "../stores/page";
import { useSearchStore } from "../stores/search";
import axios from "axios";
import FavoriteButton from "../components/FavoriteButton.vue";
import { mdiMagnify } from "@mdi/js";
import { mdiCoffeeOutline } from "@mdi/js";
import { mdiHeart } from "@mdi/js";
import Image from "../components/CoffeeImage.vue";

const authStore = useAuthStore();
const router = useRouter();
const categories = ref([]);
const stores = ref([]);
const pageStore = usePageStore();
const searchStore = useSearchStore();
const index: any = reactive({
  coffees: [],
});
const favorite: any = reactive({
  coffees: [],
});

const favorite_flg = ref(false);
const disabled_flg = ref(false);
const load = ref(false);
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
  let coffees: any = [];
  for (let i in index.coffees) {
    let coffee = index.coffees[i];
    if (
      (coffee.coffee_property.name.indexOf(searchStore.search_word) !== -1 ||
        searchStore.search_word == "") &&
      (coffee.category.id === searchStore.selected_category.id ||
        searchStore.selected_category.id == "") &&
      (coffee.coffee_property.store.id === searchStore.selected_store.id ||
        searchStore.selected_store.id == "")
    ) {
      coffees.push(coffee);
    }
  }
  if (favorite_flg.value) {
    coffees = coffees.filter(
      (coffee: any) =>
        favorite.coffees.filter((favorite: any) => favorite.id === coffee.id)
          .length > 0
    );
  }
  getResult(coffees.length);
  coffees = coffees.slice(
    itemsPerPage.value * (pageStore.page - 1),
    itemsPerPage.value * pageStore.page
  );
  return coffees;
});
//---------

const getResult = (length: any) => {
  result.value = length;
};

const startListCoffee = () => {
  if (!authStore.isAuthencated()) {
    disabled_flg.value = true;
  }
};

const searchReset = () => {
  searchStore.setWord("");
  searchStore.setCategory("");
  searchStore.setStore("");
  pageStore.setPage(1);
};

const change_favorite = () => {
  favorite_flg.value = false;
};

const pageReset = () => {
  pageStore.setPage(1);
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

//2お気に入り取得
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
      pageStore.setPage(1);
      console.log(favorite.coffees);
    });
}

//3API側で検索結果を表示する
async function setSearch(): Promise<void> {
  await axios
    .post("/api/v1/coffees/search", {
      search: {
        word: searchStore.search_word,
        category: searchStore.selected_category.id,
        store: searchStore.selected_store.id,
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
            @change="pageReset()"
            v-model="searchStore.search_word"
            clearable
            label="商品名+Enterで検索"
            variant="underlined"
            :prepend-icon="mdiMagnify"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            @focus="pageReset()"
            v-model="searchStore.selected_category.id"
            :prepend-icon="mdiMagnify"
            label="分類"
            :hint="`${searchStore.selected_category.id},${searchStore.selected_category.name}`"
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
            @focus="pageReset()"
            v-model="searchStore.selected_store.id"
            :prepend-icon="mdiMagnify"
            label="販売店"
            :hint="`${searchStore.selected_store.id},${searchStore.selected_store.name}`"
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
              <Image v-bind:id="coffee.category_id" v-bind:height="100" />
              <div class="bg_color txt_white">
                <v-card-item>
                  <v-card-title class="text-body-1"
                    >{{ coffee.coffee_property.name }}
                  </v-card-title>
                  <v-card-subtitle class="text-body-1">
                    {{ coffee.coffee_property.store.name }}
                  </v-card-subtitle>
                </v-card-item>
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
                  <v-btn
                    class="mx-auto"
                    @click="
                      router.push({
                        path: `/coffees/${coffee.id}`,
                      })
                    "
                    >詳細
                  </v-btn>
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
        v-model="pageStore.page"
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
</style>
