<script setup lang="ts">
import { reactive, ref, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { usePageStore } from "../stores/page";
import { useSearchStore } from "../stores/search";
import axios from "axios";
import moment from "moment";
import { mdiMagnify } from "@mdi/js";
import { mdiAutorenew } from "@mdi/js";
import { mdiCommentTextOutline } from "@mdi/js";
import { mdiEmoticonExcitedOutline } from "@mdi/js";
import { mdiEmoticonHappyOutline } from "@mdi/js";
import { mdiEmoticonNeutralOutline } from "@mdi/js";
import { mdiEmoticonSadOutline } from "@mdi/js";
import { mdiEmoticonDeadOutline } from "@mdi/js";
import { URL } from "../url";

const authStore = useAuthStore();
const router = useRouter();
const pageStore = usePageStore();
const searchStore = useSearchStore();
const categories = ref([]);
const stores = ref([]);
const index: any = reactive({
  reviews: [],
});

const emotion: any = {
  5: mdiEmoticonExcitedOutline,
  4: mdiEmoticonHappyOutline,
  3: mdiEmoticonNeutralOutline,
  2: mdiEmoticonSadOutline,
  1: mdiEmoticonDeadOutline,
};

const emotion_text: any = {
  5: "大満足！！",
  4: "満足！",
  3: "普通",
  2: "うーん",
  1: "合わなかった",
};

const emotion_color: any = {
  5: "red",
  4: "orange",
  3: "green",
  2: "blue-lighten-2",
  1: "indigo",
};

//ページネーション関連
const result = ref(1);
let itemsPerPage = ref(8);
const screenWidth = ref(window.innerWidth);

//画面サイズが変更したらresizeメソッドが動く
onMounted(() => {
  window.addEventListener("resize", resize);
});

//画面サイズによって画面幅を変更
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

//算出プロパティで1ページあたりの表示を決定
const getReviews = computed(() => {
  let reviews = [];
  getResult(index.reviews.length);
  reviews = index.reviews.slice(
    itemsPerPage.value * (pageStore.review_page - 1),
    itemsPerPage.value * pageStore.review_page
  );
  return reviews;
});

const getResult = (length: any) => {
  result.value = length;
};

//日付の修正
const momentDate = (date: any) => {
  return moment(date).format("YYYY/MM/DD");
};

//検索リセット
const searchReset = () => {
  searchStore.setReviewWord("");
  searchStore.setReviewCategory("");
  searchStore.setReviewStore("");
  pageStore.setReviewPage(1);
  if (searchStore.review_isall) {
    setReview();
  } else {
    setAllReview();
  }
};

const onSearch = () => {
  setSearch();
  pageStore.setReviewPage(1);
};

//切り替え時の設定
const switchReview = () => {
  if (
    searchStore.review_search_word != "" ||
    searchStore.review_selected_category.id != "" ||
    searchStore.review_selected_store.id != ""
  ) {
    setSearch();
  } else if (searchStore.review_isall) {
    setReview();
  } else {
    setAllReview();
  }
};

watch(searchStore.review_selected_category, () => {
  onSearch();
});

watch(searchStore.review_selected_store, () => {
  onSearch();
});

//api側で検索する際はwatchを使用
// watch(search_word, () => {
//   setSearch();
// });

//front側で検索する際にcomputedを使用
// const searchedReviews = computed(() => {
//   let reviews = [];
//   for (let i in index.reviews) {
//     let review = index.reviews[i];
//     if (
//       (review.coffee.coffee_property.name.indexOf(search_word.value) !== -1 ||
//         search_word.value == "") &&
//       (review.coffee.category.id === selected_category.id ||
//         selected_category.id == "") &&
//       (review.coffee.coffee_property.store.id === selected_store.id ||
//         selected_store.id == "")
//     ) {
//       reviews.push(review);
//     }
//   }
//   getResult(reviews.length);
//   reviews = reviews.slice(
//     itemsPerPage * (page.value - 1),
//     itemsPerPage * page.value
//   );
//   return reviews;
// });

async function setMaster(): Promise<void> {
  await axios
    .get(`${URL.ADDRESS}/api/v1/coffees/option`, {
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
    .get(`${URL.ADDRESS}/api/v1/reviews`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      searchStore.setReviewisAll(true);
      index.reviews = response.data;
    });
}

async function setAllReview(): Promise<void> {
  await axios
    .get(`${URL.ADDRESS}/api/v1/reviews/all`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      searchStore.setReviewisAll(false);
      index.reviews = response.data;
    });
}

//api側で検索する場合に使用
async function setSearch(): Promise<void> {
  await axios
    .post(`${URL.ADDRESS}/api/v1/reviews/search`, {
      search: {
        word: searchStore.review_search_word,
        category: searchStore.review_selected_category.id,
        store: searchStore.review_selected_store.id,
      },
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.reviews = response.data;
      // pageStore.setReviewPage(1);
      searchStore.setReviewisAll(false);
    });
}

setMaster();
resize();
switchReview();
</script>

<template>
  <v-container fluid grid-list-xl class="w-100">
    <v-row>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="searchStore.review_search_word"
          label="商品名+Enterで検索"
          variant="underlined"
          v-on:keyup.enter="onSearch()"
          clearable
          :prepend-icon="mdiMagnify"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-select
          v-model="searchStore.review_selected_category.id"
          :prepend-icon="mdiMagnify"
          label="分類"
          :hint="`${searchStore.review_selected_category.id},${searchStore.review_selected_category.name}`"
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
          v-model="searchStore.review_selected_store.id"
          :prepend-icon="mdiMagnify"
          label="販売店"
          :hint="`${searchStore.review_selected_store.id},${searchStore.review_selected_store.name}`"
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
    <v-chip class="ma-2" color="#7b5544" variant="text" size="large"
      ><v-icon start :icon="mdiCommentTextOutline"></v-icon> レビュー一覧画面
    </v-chip>
    <template v-if="authStore.isAuthencated()">
      <template v-if="searchStore.review_isall == false">
        <v-btn
          color="#7b5544"
          variant="plain"
          class="mx-auto"
          size="x-large"
          @click="setReview()"
          ><v-icon :icon="mdiAutorenew"></v-icon>全体</v-btn
        ></template
      >
      <template v-else>
        <v-btn
          color="#7b5544"
          variant="plain"
          class="mx-auto"
          size="x-large"
          @click="setAllReview()"
          ><v-icon :icon="mdiAutorenew"></v-icon>個人</v-btn
        >
      </template>
    </template>
    <v-row>
      <v-col
        v-for="review in getReviews"
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
            :elevation="isHovering ? 24 : 2"
            :class="{ 'on-hover': isHovering }"
            :color="isHovering ? '#fff7ef' : undefined"
            v-bind="props"
          >
            <div class="coffee_bg txt_white mp-2">
              <v-card-item>
                <v-card-title class="text-body-1">
                  {{ review.coffee.coffee_property.name }}
                </v-card-title>
                <v-card-subtitle>{{
                  review.coffee.coffee_property.store.name
                }}</v-card-subtitle>
              </v-card-item>
            </div>
            <v-divider></v-divider>
            <v-card-text>
              {{ review.user.name }}
              {{ momentDate(review.created_at!) }}<br />
              <v-rating
                v-model="review.intuition"
                bg-color="orange-lighten-1"
                color="blue"
                readonly
              ></v-rating>
              <v-chip
                class="ma-2"
                :color="emotion_color[review.intuition]"
                label
                text-color="white"
                size="x-large"
              >
                <v-icon start :icon="`${emotion[review.intuition]}`"></v-icon>
                {{ emotion_text[review.intuition] }}
              </v-chip>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>感想:{{ review.remarks }}</v-card-text>
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
              <template v-if="!searchStore.review_isall">
                <template v-if="!review.setting">
                  <v-btn color="#7b5544" size="large" disabled> 非公開 </v-btn>
                </template>
              </template>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <template v-if="result === 0">
      <v-row justify="center" align="center">
        <p class="coffee_txt">
          検索結果がありません。<br />検索条件を変更して下さい。
        </p>
      </v-row>
    </template>
    <v-pagination
      v-model="pageStore.review_page"
      :length="Math.ceil(result / itemsPerPage)"
      rounded="circle"
      class="mt-2"
      size="x-large"
    ></v-pagination>
  </v-container>
</template>

<style scoped>
.coffee_txt {
  color: #7b5544;
}
.coffee_bg {
  background-color: #7b5544;
}
.txt_white {
  color: #fff;
  font-weight: bold;
}
</style>
