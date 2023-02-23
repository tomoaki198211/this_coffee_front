<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { useMessageStore } from "@/stores/message";
import axios, { type AxiosResponse } from "axios";
import RadarChart from "../components/RadarChart.vue";
import { mdiArrowLeftThick } from "@mdi/js";
import Image from "../components/CoffeeImage.vue";
import { URL } from "../url";

interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const router = useRouter();
const messageStore = useMessageStore();
const evalutions = [
  { value: 5, text: "5:最高！" },
  { value: 4, text: "4:満足！" },
  { value: 3, text: "3:普通" },
  { value: 2, text: "2:微妙" },
  { value: 1, text: "1:うーん" },
];
const evalutions_rate = ["弱い", "やや弱い", "普通", "やや強い", "強い"];
const evalutions_colors = ["red", "orange", "grey", "cyan", "green"];

const coffee_id = ref(props.id);
const remarks = ref();
const setting = reactive({
  value: false,
  text: "非公開",
});
const settings = [
  { value: true, text: "公開" },
  { value: false, text: "非公開" },
];

const intuition: any = reactive({
  value: "",
  text: "",
});
const efficiency: any = reactive({
  value: "",
  text: "",
});
const attributes: any = reactive({
  flavor: null,
  sweetness: null,
  rich: null,
  acidity: null,
  bitter: null,
});

const coffee: any = reactive({
  name: "",
  store: "",
  category_id: "",
});

//選択したマスターのshow画面
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
      coffee.name = response.data.coffee.coffee_property.name;
      coffee.store = response.data.coffee.coffee_property.store.name;
      coffee.category_id = response.data.coffee.category_id;
    });
}

//投稿処理
async function postReview(): Promise<void> {
  const data = {
    review: {
      coffee_id: coffee_id.value,
      intuition: intuition.value,
      efficiency: efficiency.value,
      remarks: remarks.value,
      setting: setting.value,
      flavor: attributes.flavor,
      sweetness: attributes.sweetness,
      rich: attributes.rich,
      acidity: attributes.acidity,
      bitter: attributes.bitter,
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
    .post(`${URL.ADDRESS}/api/v1/reviews`, data, config)
    .then((response) => {
      router.push("/reviews");
      messageStore.flash("レビューを作成しました");
    })
    .catch((error) => {
      messageStore.flash(
        "作成出来ませんでした。必須項目を入力して下さい",
        "red"
      );
    });
}
showCoffee();
</script>

<template>
  <v-container fluid grid-list-xl class="container_out">
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
        <v-card class="mx-auto" max-width="320">
          <Image :id="coffee.category_id" :height="190" />
          <v-list-item>
            <v-list-item-title>{{ coffee.store }} </v-list-item-title>
            <v-list-item-subtitle>{{ coffee.name }}</v-list-item-subtitle>
          </v-list-item>
        </v-card>
        <v-card class="mt-5">
          <v-table density="compact">
            <tbody>
              <tr>
                <td>
                  <v-select
                    v-model="intuition.value"
                    density="compact"
                    label="直感的な評価(必須項目)"
                    :items="evalutions"
                    item-title="text"
                    item-value="value"
                    color="red"
                    class="pt-5"
                  >
                  </v-select>
                </td>
              </tr>
              <tr>
                <td>
                  <v-select
                    v-model="efficiency.value"
                    density="compact"
                    label="コストパフォーマンス(必須項目)"
                    :items="evalutions"
                    item-title="text"
                    item-value="value"
                    color="red"
                    class="pt-5"
                  >
                  </v-select>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
        <v-card class="mt-2">
          <v-list>
            <v-list-item>
              <v-textarea
                v-model="remarks"
                label="感想(必須項目)"
                rows="2"
                color="red"
                class=""
              />
              <v-select
                v-model="setting.value"
                density="compact"
                label="公開・非公開(必須項目)"
                :items="settings"
                item-title="text"
                item-value="value"
                color="red"
                class=""
              >
              </v-select>
            </v-list-item>
            <v-card-actions>
              <v-btn
                class="mx-auto"
                variant="flat"
                color="#7b5544"
                width="200px"
                @click="postReview()"
              >
                <p class="font-weight-bold btn-txt">レビューを投稿する</p>
              </v-btn>
            </v-card-actions>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="mx-auto my-auto">
          <div class="d-flex justify-center">
            <RadarChart
              :flavor="attributes.flavor"
              :sweetness="attributes.sweetness"
              :rich="attributes.rich"
              :acidity="attributes.acidity"
              :bitter="attributes.bitter"
            />
          </div>
        </v-card>
        <v-card class="mt-5">
          <v-table density="compact">
            <tbody>
              <tr>
                <td>風味</td>
                <td>
                  <v-rating
                    v-model="attributes.flavor"
                    :item-labels="evalutions_rate"
                    color="#7b5544"
                    hover
                    ><template v-slot:item-label="props">
                      <span
                        class="font-weight-black text-caption"
                        :class="`text-${evalutions_colors[props.index]}`"
                      >
                        {{ props.label }}
                      </span>
                    </template>
                  </v-rating>
                </td>
              </tr>
              <tr>
                <td>甘み</td>
                <td>
                  <v-rating
                    v-model="attributes.sweetness"
                    :item-labels="evalutions_rate"
                    color="#7b5544"
                    hover
                    ><template v-slot:item-label="props">
                      <span
                        class="font-weight-black text-caption"
                        :class="`text-${evalutions_colors[props.index]}`"
                      >
                        {{ props.label }}
                      </span>
                    </template>
                  </v-rating>
                </td>
              </tr>
              <tr>
                <td>コク</td>
                <td>
                  <v-rating
                    v-model="attributes.rich"
                    :item-labels="evalutions_rate"
                    color="#7b5544"
                    hover
                    ><template v-slot:item-label="props">
                      <span
                        class="font-weight-black text-caption"
                        :class="`text-${evalutions_colors[props.index]}`"
                      >
                        {{ props.label }}
                      </span>
                    </template>
                  </v-rating>
                </td>
              </tr>
              <tr>
                <td>酸味</td>
                <td>
                  <v-rating
                    v-model="attributes.acidity"
                    :item-labels="evalutions_rate"
                    color="#7b5544"
                    hover
                    ><template v-slot:item-label="props">
                      <span
                        class="font-weight-black text-caption"
                        :class="`text-${evalutions_colors[props.index]}`"
                      >
                        {{ props.label }}
                      </span>
                    </template>
                  </v-rating>
                </td>
              </tr>
              <tr>
                <td>苦味</td>
                <td>
                  <v-rating
                    v-model="attributes.bitter"
                    :item-labels="evalutions_rate"
                    color="#7b5544"
                    hover
                    ><template v-slot:item-label="props">
                      <span
                        class="font-weight-black text-caption"
                        :class="`text-${evalutions_colors[props.index]}`"
                      >
                        {{ props.label }}
                      </span>
                    </template>
                  </v-rating>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.container_out {
  width: 100%;
}
td {
  text-align: center;
}
.btn-txt {
  color: white;
}
</style>
