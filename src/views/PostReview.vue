<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import axios, { type AxiosResponse } from "axios";
import RadarChart from "../components/RadarChart.vue";

interface Props {
  id: number;
}
interface attribute {
  flavor: number;
  sweetness: number;
  rich: number;
  acidity: number;
  bitter: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const router = useRouter();
const evalutions = [
  { value: 5, text: "5:最高！" },
  { value: 4, text: "4:満足！" },
  { value: 3, text: "3:普通" },
  { value: 2, text: "2:微妙" },
  { value: 1, text: "1:うーん" },
];
const evalutions_rate = ["弱い", "やや弱い", "普通", "やや強い", "強い"];
const evalutions_colors = ["red", "orange", "grey", "cyan", "green"];

const coffee_id: number = ref(props.id);
const remarks: string = ref();
const setting: boolean = ref(false);

const intuition = reactive({
  value: "",
  text: "",
});
const efficiency = reactive({
  value: "",
  text: "",
});
const attributes: attribute = reactive({
  flavor: null,
  sweetness: null,
  rich: null,
  acidity: null,
  bitter: null,
});
const prop_name = ref("");

showCoffee();

//選択したマスターのshow画面
async function showCoffee(): Promise<void> {
  await axios
    .get(`http://localhost:3000/api/v1/coffees/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      prop_name.value = response.data;
      console.log(response.data);
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
    .post("http://localhost:3000/api/v1/reviews", data, config)
    .then((response) => {
      router.push("/reviews");
      console.log(response.data);
    });
}
</script>

<template>
  <v-container fluid grid-list-xl class="container_out">
    <v-row width="95%">
      <v-col cols="12" sm="5">
        <v-card class="mx-auto" max-width="320">
          <v-img src="" alt="" height="190" cover></v-img>
          <v-list-item>
            <v-list-item-title
              >{{
                prop_name ? prop_name.coffee.coffee_property.store.name : ""
              }}
            </v-list-item-title>
            <v-list-item-subtitle>{{
              prop_name ? prop_name.coffee.coffee_property.name : ""
            }}</v-list-item-subtitle>
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
                    label="直感的な評価"
                    :hint="`${intuition.value},${intuition.text}`"
                    :items="evalutions"
                    item-title="text"
                    item-value="value"
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
                    label="コストパフォーマンス"
                    :hint="`${efficiency.value},${efficiency.text}`"
                    :items="evalutions"
                    item-title="text"
                    item-value="value"
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
              <v-textarea v-model="remarks" label="備考" rows="2" class="" />
              <v-list-item-title>
                ※レビューを公開しない場合は非公開
              </v-list-item-title>
              <v-switch
                v-model="setting"
                hide-details
                color="primary"
                class="ml-5"
                true-value="公開"
                false-value="非公開"
                :label="setting || '非公開'"
              ></v-switch>
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

      <v-col cols="12" sm="7">
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
  width: 95%;
}
td {
  text-align: center;
}
.btn-txt {
  color: white;
}
</style>
