<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import FavoriteButton from "../components/FavoriteButton.vue";
import { mdiMagnify } from "@mdi/js";

const authStore = useAuthStore();
const router = useRouter();
const index = reactive({
  coffees: [],
});
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
const load = ref(false);
const page = ref(1);
const result = ref();
const itemsPerPage = 8;

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
  getResult(coffees.length);
  coffees = coffees.slice(
    itemsPerPage * (page.value - 1),
    itemsPerPage * page.value
  );
  return coffees;
});
//---------

const getResult = (length) => {
  result.value = length;
};

setCoffee();
setMaster();

//0マスター取得用
async function setMaster(): Promise<void> {
  await axios
    .get("http://localhost:3000/api/v1/coffees/mdata", {
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

//1 axios コーヒーは直近1０件ほどに制限
async function setCoffee(): Promise<void> {
  await axios
    .get("http://localhost:3000/api/v1/coffees", {
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

// 2 axios 検索結果を表示する
async function setSearch(): Promise<void> {
  await axios
    .post("http://localhost:3000/api/v1/coffees/search", {
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

const searchReset = () => {
  selected_category.id = "";
  selected_store.id = "";
  search_word.value = "";
};
</script>

<template>
  <div>
    <v-container fluid grid-list-xl class="container_out">
      <v-row>
        <v-col cols="12" sm="5">
          <v-text-field
            v-model="search_word"
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
        <v-col cols="12" sm="1">
          <v-btn
            icon
            color="#7b5544"
            variant="plain"
            class="mx-auto ml-3"
            @click="searchReset()"
            ><p>検索リセット</p>
          </v-btn>
        </v-col>
      </v-row>
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
              :elevation="isHovering ? 16 : 2"
              :class="{ 'on-hover': isHovering }"
              :color="isHovering ? '#fff4ea' : undefined"
              v-bind="props"
            >
              <v-img src="" alt="" height="100" cover></v-img>
              <v-list-item>
                <v-list-item-title
                  >{{ coffee.coffee_property.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  coffee.coffee_property.store.name
                }}</v-list-item-subtitle>
              </v-list-item>
              <v-card-actions>
                <v-btn
                  class="mx-auto"
                  color="#7b5544"
                  @click="
                    router.push({
                      path: `/review/post/${coffee.id}`,
                    })
                  "
                  >レビューを書く
                </v-btn>
                <v-btn class="mx-auto" color="#7b5544">詳細 </v-btn>
                <FavoriteButton v-bind:coffee_id="coffee.id" />
                <v-spacer></v-spacer>
              </v-card-actions>
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
      ></v-pagination>
    </v-container>
  </div>
</template>

<style scoped>
.container_out {
  width: 100%;
}
.coffee_txt {
  color: #7b5544;
}
</style>
