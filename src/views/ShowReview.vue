<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
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

const review_created = ref();
const coffee_id: number = ref(props.id);
const review_id: number = ref();
const remarks: string = ref();
const setting = reactive({
  value: "",
  text: "",
});
const settings = [
  { value: true, text: "公開" },
  { value: false, text: "非公開" },
];
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
const disabled_flg = ref(true);

setReview();

async function setReview(): Promise<void> {
  await axios
    .get(`http://localhost:3000/api/v1/reviews/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      console.log(response.data);
      coffee_id.value = response.data.review.coffee.id;
      review_id.value = response.data.review.id;
      review_created.value = response.data.review.created_at;
      remarks.value = response.data.review.remarks;
      setting.value = response.data.review.setting;
      intuition.value = response.data.review.intuition;
      efficiency.value = response.data.review.efficiency;
      attributes.flavor = response.data.review.flavor;
      attributes.sweetness = response.data.review.sweetness;
      attributes.rich = response.data.review.rich;
      attributes.acidity = response.data.review.acidity;
      attributes.bitter = response.data.review.bitter;
    });
}
async function destroyReview(id): Promise<void> {
  await axios
    .delete(`http://localhost:3000/api/v1/reviews/${id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      console.log(response.status);
      router.push("/reviews");
    });
}
const onEdit = () => {
  disabled_flg.value = false;
};
const onShow = () => {
  disabled_flg.value = true;
  setReview();
};

async function updateReview(): Promise<void> {
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
    .patch(
      `http://localhost:3000/api/v1/reviews/${review_id.value}`,
      data,
      config
    )
    .then((response) => {
      setReview();
      onShow();
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
              >{{ show ? show.review.coffee.coffee_property.name : "" }}
            </v-list-item-title>
            <v-list-item-subtitle>{{
              show ? show.review.coffee.coffee_property.name : ""
            }}</v-list-item-subtitle>
          </v-list-item>
        </v-card>
        <v-card class="mt-5">
          <v-list>
            <v-list-item>{{}}</v-list-item>
          </v-list>
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
                    v-bind:readonly="disabled_flg"
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
                    v-bind:readonly="disabled_flg"
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
                label="備考"
                rows="2"
                class=""
                v-bind:readonly="disabled_flg"
              />
              <v-select
                v-model="setting.value"
                density="compact"
                label="公開・非公開"
                :hint="`${setting.value},${setting.text}`"
                :items="settings"
                item-title="text"
                item-value="value"
                class=""
                v-bind:readonly="disabled_flg"
              >
              </v-select>
            </v-list-item>
            <v-card-actions>
              <template v-if="disabled_flg == true">
                <v-btn
                  class="mx-auto"
                  variant="flat"
                  color="#7b5544"
                  @click="onEdit()"
                >
                  <p class="font-weight-bold btn-txt">編集</p>
                </v-btn>
                <v-btn
                  class="mx-auto"
                  variant="flat"
                  color="#7b5544"
                  @click="destroyReview(review_id)"
                >
                  <p class="font-weight-bold btn-txt">削除</p>
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  class="mx-auto"
                  variant="flat"
                  color="#7b5544"
                  @click="onShow()"
                >
                  <p class="font-weight-bold btn-txt">編集取消し</p>
                </v-btn>
                <v-btn
                  class="mx-auto"
                  variant="flat"
                  color="#7b5544"
                  @click="updateReview()"
                >
                  <p class="font-weight-bold btn-txt">更新</p>
                </v-btn>
              </template>
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
                    v-bind:readonly="disabled_flg"
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
                    v-bind:readonly="disabled_flg"
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
                    v-bind:readonly="disabled_flg"
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
                    v-bind:readonly="disabled_flg"
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
                    v-bind:readonly="disabled_flg"
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
