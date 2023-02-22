<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useMessageStore } from "@/stores/message";
import { useRouter } from "vue-router";
import axios, { type AxiosResponse } from "axios";
import { mdiArrowLeftThick } from "@mdi/js";
import { mdiCoffeeOutline } from "@mdi/js";
import RadarChart from "../components/RadarChart.vue";
import Image from "../components/CoffeeImage.vue";
import GetTweet from "../components/GetTweet.vue";
import { URL } from "../url";

interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const messageStore = useMessageStore();
const router = useRouter();
const coffee: any = reactive({
  coffee_id: "",
  category_name: "",
  cstore_name: "",
  property_id: "",
  name: "",
  size: "",
  price: "",
  note: "",
  image: "",
  count: "",
  favorites: "",
});
const review = reactive({
  intuition: 0,
  efficiency: 0,
  flavor: 0,
  sweetness: 0,
  rich: 0,
  acidity: 0,
  bitter: 0,
});
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
const tab = ref();
setMaster();
showCoffee();

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

async function showCoffee(): Promise<void> {
  await axios
    .get(`${URL.ADDRESS}/api/v1/coffees/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      selected_store.name = response.data.coffee.coffee_property.store.name;
      selected_category.name = response.data.coffee.category.name;
      selected_category.id = response.data.coffee.category.id;
      coffee.coffee_id = response.data.coffee.id;
      coffee.property_id = response.data.coffee.coffee_property.id;
      coffee.category_name = response.data.coffee.category.name;
      coffee.store_name = response.data.coffee.coffee_property.store.name;
      coffee.name = response.data.coffee.coffee_property.name;
      coffee.size = response.data.coffee.coffee_property.size;
      coffee.price = response.data.coffee.coffee_property.price;
      coffee.note = response.data.coffee.coffee_property.note;
      coffee.image = response.data.coffee.coffee_property.image;
      coffee.count = response.data.count;
      coffee.favorites = response.data.favorites;
      review.intuition = response.data.intuition;
      review.efficiency = response.data.efficiency;
      review.flavor = response.data.flavor;
      review.sweetness = response.data.sweetness;
      review.rich = response.data.rich;
      review.acidity = response.data.acidity;
      review.bitter = response.data.bitter;
    });
}
</script>
<template>
  <v-container>
    <v-row width="100%">
      <v-col cols="12" sm="1">
        <v-btn
          color="#7b5544"
          variant="plain"
          class="mx-auto"
          size="large"
          icon
          @click="router.push('/coffees')"
          ><v-icon :icon="mdiArrowLeftThick" size="large"></v-icon
        ></v-btn>
      </v-col>
      <v-col cols="12" sm="5">
        <v-card class="mx-auto" max-width="400" color="#fff7ef">
          <v-chip class="ma-2" color="#7b5544" variant="text" size="large"
            ><v-icon start :icon="mdiCoffeeOutline"></v-icon>
            コーヒーマスタ
          </v-chip>
          <!-- <v-img src="" alt="" height="150" cover></v-img> -->
          <Image v-bind:id="Number(selected_category.id)" v-bind:height="150" />
          <v-divider></v-divider>
          <v-card-item>
            <v-card-title class="text-body-1"> {{ coffee.name }}</v-card-title>
            <v-card-subtitle>
              {{ selected_store.name }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-item>
            <v-card-title> {{ selected_category.name }}</v-card-title>
            <v-card-subtitle>分類名 </v-card-subtitle>
          </v-card-item>
          <v-card-item>
            <v-card-title> {{ coffee.size }}</v-card-title>
            <v-card-subtitle>サイズ</v-card-subtitle>
          </v-card-item>
          <v-card-item>
            <v-card-title> {{ coffee.price }}円〜</v-card-title>
            <v-card-subtitle>価格</v-card-subtitle>
          </v-card-item>
          <v-divider></v-divider>
          <v-textarea reaonly disabled>{{ coffee.note }}</v-textarea>
        </v-card>
      </v-col>
      <v-col cols="12" sm="5">
        <v-card class="mx-auto" max-width="400" color="#fff7ef">
          <v-tabs v-model="tab" bg-color="primary">
            <v-tab value="one">レビュー</v-tab>
            <v-tab value="two">ツイート直近10件</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item value="one">
              <v-card-item>
                <v-card-title>レビュー(平均)</v-card-title>
              </v-card-item>
              <v-card-item>
                <v-card-subtitle class="text-body-1"
                  >レビュー件数:{{ coffee.count }}件</v-card-subtitle
                ></v-card-item
              >
              <v-card-item>
                <v-card-subtitle class="text-body-1"
                  >お気に入り件数:{{ coffee.favorites }}件</v-card-subtitle
                >
              </v-card-item>
              <v-divider></v-divider>
              <v-card-item>
                <v-card-subtitle class="text-body-1"
                  >直感的な評価:{{
                    Number(review.intuition).toFixed(2)
                  }}</v-card-subtitle
                >
              </v-card-item>
              <v-rating
                v-model="review.intuition"
                class=""
                color="#7b5544"
                readonly
                half-increments
              ></v-rating>
              <v-card-item>
                <v-card-subtitle class="text-body-1"
                  >コストパフォーマンス:{{
                    Number(review.efficiency).toFixed(2)
                  }}</v-card-subtitle
                >
              </v-card-item>
              <v-rating
                color="#7b5544"
                v-model="review.efficiency"
                readonly
                half-increments
              ></v-rating>
              <v-divider></v-divider>
              <div class="d-flex justify-center">
                <RadarChart
                  :flavor="review.flavor"
                  :sweetness="review.sweetness"
                  :rich="review.rich"
                  :acidity="review.acidity"
                  :bitter="review.bitter"
                />
              </div>
            </v-window-item>
            <v-window-item value="two">
              <GetTweet :name="coffee.name" />
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.btn-txt {
  color: #ffff;
}
</style>
