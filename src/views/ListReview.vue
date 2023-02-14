<script setup lang="ts">
import { reactive, ref, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import { mdiMagnify } from "@mdi/js";
import { mdiAutorenew } from "@mdi/js";
import { mdiCommentTextOutline } from "@mdi/js";
import { mdiLockOutline } from "@mdi/js";
import moment from "moment";

const authStore = useAuthStore();
const router = useRouter();
const index = reactive({
  reviews: [],
});
const search_word: string = ref("");
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
const isAll: boolean = ref(false);
const load = ref(false);

//ページネーション関連
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
    itemsPerPage = 18;
  } else if (screenWidth.value > 1280) {
    itemsPerPage = 12;
  } else if (screenWidth.value > 768) {
    itemsPerPage = 8;
  } else if (screenWidth.value > 600) {
    itemsPerPage = 6;
  } else if (screenWidth.value > 400) {
    itemsPerPage = 4;
  } else {
    itemsPerPage = 3;
  }
};

const momentDate = (date) => {
  return moment(date).format("YYYY/MM/DD");
};

const searchReset = () => {
  selected_category.id = "";
  selected_store.id = "";
  search_word.value = "";
};

const startReview = () => {
  if (!authStore.isAuthencated()) {
    setAllReview();
  } else {
    setReview();
  }
};

//front側で検索する際にcomputedを使用
const searchedReviews = computed(() => {
  let reviews = [];
  for (let i in index.reviews) {
    let review = index.reviews[i];
    if (
      (review.coffee.coffee_property.name.indexOf(search_word.value) !== -1 ||
        search_word.value == "") &&
      (review.coffee.category.id === selected_category.id ||
        selected_category.id == "") &&
      (review.coffee.coffee_property.store.id === selected_store.id ||
        selected_store.id == "")
    ) {
      reviews.push(review);
    }
  }
  getResult(reviews.length);
  reviews = reviews.slice(
    itemsPerPage * (page.value - 1),
    itemsPerPage * page.value
  );
  return reviews;
});

const getResult = (length) => {
  result.value = length;
};

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

async function setReview(): Promise<void> {
  await axios
    .get("/api/v1/reviews", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      isAll.value = false;
      index.reviews = response.data;
      load.value = true;
      console.log(response.data);
    });
}

async function setAllReview(): Promise<void> {
  await axios
    .get("/api/v1/reviews/all", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      isAll.value = true;
      index.reviews = response.data;
      console.log(response.data);
    });
}

//api側で検索する場合に使用
async function setSearch(): Promise<void> {
  await axios
    .post("/api/v1/reviews/search", {
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
      index.reviews = response.data;
      console.log(response.data);
    });
}

startReview();
setMaster();

//api側で検索する際はwatchを使用
// watch(search_word, () => {
//   setSearch();
// });

// watch(selected_category, () => {
//   setSearch();
// });

// watch(selected_store, () => {
//   setSearch();
// });
</script>

<template>
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
          @click="searchReset()"
          size="x-large"
          ><p>検索リセット</p>
        </v-btn>
      </v-col>
    </v-row>
    <v-chip class="ma-2" color="#7b5544" label size="large"
      ><v-icon start :icon="mdiCommentTextOutline"></v-icon> レビュー一覧画面
    </v-chip>

    <template v-if="isAll == false">
      <v-btn
        color="#7b5544"
        variant="plain"
        class="mx-auto"
        size="x-large"
        @click="setAllReview()"
        ><v-icon :icon="mdiAutorenew"></v-icon>個人</v-btn
      ></template
    >
    <template v-else>
      <template v-if="authStore.isAuthencated()">
        <v-btn
          color="#7b5544"
          variant="plain"
          class="mx-auto"
          size="x-large"
          @click="setReview()"
          ><v-icon :icon="mdiAutorenew"></v-icon>全体</v-btn
        >
      </template>
    </template>
    <v-row>
      <v-col
        v-for="review in searchedReviews"
        :key="review.id"
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
            style="border-width: 2px"
            :elevation="isHovering ? 16 : 2"
            :class="{ 'on-hover': isHovering }"
            :color="isHovering ? '#fff7ef' : undefined"
            v-bind="props"
          >
            <v-list-item class="mb-1 txt_white head_bg">
              <v-list-item-title>
                {{ review.coffee.coffee_property.name }}
              </v-list-item-title>
              <v-list-item-title>{{
                review.coffee.coffee_property.store.name
              }}</v-list-item-title>
            </v-list-item>
            <v-card-text>
              <v-row class="">
                <v-col>
                  {{ review.user.name }}
                  {{ momentDate(review.created_at) }}
                </v-col>
              </v-row>
              直感的な評価:{{ review.intuition }}<br />
              コストパフォーマンス:{{ review.efficiency }}<br />
              感想:{{ review.remarks }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="mx-auto"
                color="#7b5544"
                size="large"
                @click="
                  router.push({
                    path: `/review/${review.id}`,
                  })
                "
                >詳細
              </v-btn>
              <v-spacer></v-spacer>
              <template v-if="!isAll">
                <template v-if="!review.setting">
                  <v-icon :icon="mdiLockOutline" size="large"></v-icon>
                </template>
              </template>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <template
      v-if="index.reviews !== 0 && searchedReviews.length === 0 && load == true"
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
</template>

<style scoped>
.container_out {
  width: 100%;
}
.coffee_txt {
  color: #7b5544;
}
.head_bg {
  background-color: #7b5544;
}
.txt_white {
  color: #fff;
  font-weight: bold;
}
</style>
