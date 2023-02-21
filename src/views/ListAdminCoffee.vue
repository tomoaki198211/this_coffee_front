<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import { mdiMagnify } from "@mdi/js";
import { mdiPlus } from "@mdi/js";
import { mdiCoffeeOutline } from "@mdi/js";

const authStore = useAuthStore();
const router = useRouter();
const index: any = reactive({
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
const result = ref(1);
let itemsPerPage = 8;
const screenWidth = ref(window.innerWidth);
onMounted(() => {
  window.addEventListener("resize", resize);
});
const resize = () => {
  screenWidth.value = window.innerWidth;
  if (screenWidth.value > 1920) {
    itemsPerPage = 20;
  } else if (screenWidth.value > 1280) {
    itemsPerPage = 16;
  } else if (screenWidth.value > 768) {
    itemsPerPage = 10;
  } else if (screenWidth.value > 600) {
    itemsPerPage = 10;
  } else if (screenWidth.value > 400) {
    itemsPerPage = 8;
  } else {
    itemsPerPage = 6;
  }
};

//front側で検索する際にcomputedを使用
const searchedCoffees = computed(() => {
  let coffees: any = [];
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

const getResult = (length: any) => {
  result.value = length;
};

setCoffee();
setMaster();

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

//1 axios コーヒーは直近1０件ほどに制限
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
        <v-col cols="12" sm="4">
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
        ><v-icon start :icon="mdiCoffeeOutline"></v-icon>
        コーヒーマスタ管理画面
      </v-chip>
      <v-btn
        color="#7b5544"
        variant="plain"
        class="mx-auto"
        size="large"
        @click="
          router.push({
            path: '/coffees/admin/post',
          })
        "
        ><v-icon :icon="mdiPlus"></v-icon>新規作成
      </v-btn>
      <v-table density="compact">
        <thead class="head_bg">
          <tr>
            <th><p class="txt_white">商品名</p></th>
            <th><p class="txt_white">分類</p></th>
            <th><p class="txt_white">販売店名</p></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coffee in searchedCoffees" :key="coffee.id">
            <td>
              <v-btn
                variant="text"
                size="small"
                @click="
                  router.push({
                    path: `/coffees/admin/edit/${coffee.id}`,
                  })
                "
              >
                {{ coffee.coffee_property.name }}
              </v-btn>
            </td>
            <td>{{ coffee.category.name }}</td>
            <td>{{ coffee.coffee_property.store.name }}</td>
          </tr>
        </tbody>
      </v-table>
      <template
        v-if="
          index.coffees.length !== 0 && searchedCoffees == 0 && load == true
        "
      >
        <v-row justify="center" align="center">
          <p class="coffee_txt mt-5">
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
.container_out {
  width: 100%;
}
.coffee_txt {
  color: #7b5544;
}
td {
  font-size: 13px;
}
.head_bg {
  background-color: #7b5544;
}
.txt_white {
  color: #fff;
}
</style>
