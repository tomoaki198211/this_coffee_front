<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import { mdiMagnify } from "@mdi/js";
import { mdiAutorenew } from "@mdi/js";
import { mdiCommentOutline } from "@mdi/js";
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
const whole: boolean = ref(false);
const load = ref(false);
const page = ref(1);
const result = ref();
const itemsPerPage = 8;
const momentDate = (date) => {
  return moment(date).format("YYYY/MM/DD");
};
const searchReset = () => {
  selected_category.id = "";
  selected_store.id = "";
  search_word.value = "";
  // setReview();
};

// const goToPage = (page) => {
//   searchedReviews.value = searchedReviews.value.slice(
//     itemsPerPage * (page - 1),
//     itemsPerPage * page
//   );
// };

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

setMaster();
setReview();

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
//---------

const getResult = (length) => {
  result.value = length;
};

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

async function setReview(): Promise<void> {
  await axios
    .get("http://localhost:3000/api/v1/reviews", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      whole.value = false;
      index.reviews = response.data;
      load.value = true;
      console.log(response.data);
    });
}

async function setAllReview(): Promise<void> {
  await axios
    .get("http://localhost:3000/api/v1/reviews/all", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      whole.value = true;
      index.reviews = response.data;
      console.log(response.data);
    });
}

async function setSearch(): Promise<void> {
  await axios
    .post("http://localhost:3000/api/v1/reviews/search", {
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
</script>

<template>
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
    <template v-if="whole == false">
      <v-btn
        color="#7b5544"
        variant="plain"
        class="mx-auto"
        size="large"
        @click="setAllReview()"
        ><v-icon :icon="mdiAutorenew"></v-icon>全体</v-btn
      ></template
    >
    <template v-else>
      <v-btn
        color="#7b5544"
        variant="plain"
        class="mx-auto"
        size="large"
        @click="setReview()"
        ><v-icon :icon="mdiAutorenew"></v-icon>個人</v-btn
      >
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
            :color="isHovering ? '#fff4ea' : undefined"
            v-bind="props"
          >
            <v-list-item>
              <v-list-item-title>
                {{ review.coffee.coffee_property.name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{
                review.coffee.coffee_property.store.name
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-row>
                <v-col>
                  <v-list-item-subtitle>
                    {{ review.user.name }}
                  </v-list-item-subtitle>
                </v-col>
                <v-col>
                  <v-list-item-subtitle>
                    {{ momentDate(review.created_at) }}
                  </v-list-item-subtitle>
                </v-col>
              </v-row>
              <v-list-item-title class="mt-2">
                直感的な評価:{{ review.intuition }}
              </v-list-item-title>
              <v-list-item-title>
                コストパフォーマンス:{{ review.efficiency }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-textarea
                :placeholder="review.remarks"
                variant="underlined"
                rows="1"
                class=""
                readonly
              />
            </v-list-item>
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
</style>
