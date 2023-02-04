<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import axios, { type AxiosResponse } from "axios";
import type { Coffee } from "./CoffeeInterfaces";
import RadarChart from "../components/RadarChart.vue";

interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const evalutions = [
  { value: 5, text: "5:高い" },
  { value: 4, text: "4:やや高い" },
  { value: 3, text: "3:普通" },
  { value: 2, text: "2:やや低い" },
  { value: 1, text: "1:低い" },
];

const item: Coffee = reactive({
  coffee_id: props.id,
  intuition: 3,
  efficiency: 3,
  flavor: 3,
  sweetness: 3,
  rich: 3,
  acidity: 3,
  bitter: 3,
  remarks: "",
  setting: false,
});

const intuition = reactive({
  value: 3,
  text: "",
});
const efficiency = reactive({
  value: 3,
  text: "",
});
const flavor = reactive({
  value: 3,
  text: "",
});
const sweetness = reactive({
  value: 3,
  text: "",
});
const rich = reactive({
  value: 3,
  text: "",
});
const acidity = reactive({
  value: 3,
  text: "",
});
const bitter = reactive({
  value: 3,
  text: "",
});

const p_name = ref("");

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
      p_name.value = response.data;
      console.log(response.data);
    });
}

//投稿処理
async function postCoffee(): Promise<void> {
  const data = {
    review: {
      coffee_id: item.coffee_id,
      intuition: intuition.value,
      efficiency: efficiency.value,
      flavor: flavor.value,
      sweetness: sweetness.value,
      rich: rich.value,
      acidity: acidity.value,
      bitter: bitter.value,
      remarks: item.remarks,
      setting: item.setting,
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
      console.log(response.data);
    });
}
</script>

<template>
  <v-container fluid grid-list-xl class="container_out">
    <v-row width="95%">
      <v-col cols="12" sm="6">
        <v-card class="mx-auto" max-width="300">
          <v-img src="" alt="" height="200" cover></v-img>
          <v-list-item>
            <v-list-item-title
              >{{ p_name ? p_name.coffee.coffee_property.store.name : "" }}
            </v-list-item-title>
            <v-list-item-subtitle>{{
              p_name ? p_name.coffee.coffee_property.name : ""
            }}</v-list-item-subtitle>
          </v-list-item>
        </v-card>
        <v-card class="mx-auto my-auto mt-10" max-width="300">
          <div class="d-flex justify-center">
            <RadarChart
              :flavor="flavor.value"
              :sweetness="sweetness.value"
              :rich="rich.value"
              :acidity="acidity.value"
              :bitter="bitter.value"
            />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-table density="compact" :table-row-height="0.5">
            <thead>
              <tr>
                <th>評価項目名</th>
                <th>評価</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>直感的な評価</td>
                <td>
                  <v-select
                    v-model="intuition.value"
                    label="直感的な評価"
                    :hint="`${intuition.value},${intuition.text}`"
                    :items="evalutions"
                    item-title="text"
                    item-value="value"
                    variant="underlined"
                    class="text-center"
                  >
                  </v-select>
                </td>
              </tr>
              <tr>
                <td>コストパフォーマンス</td>
                <td>
                  <v-select
                    v-model="efficiency.value"
                    label="直感的な評価"
                    :hint="`${efficiency.value},${efficiency.text}`"
                    :items="evalutions"
                    item-title="text"
                    item-value="value"
                    variant="underlined"
                    class="text-center"
                  >
                  </v-select>
                </td>
              </tr>
              <tr>
                <td>風味</td>
                <td>
                  <v-select
                    v-model="flavor.value"
                    label="直感的な評価"
                    :hint="`${flavor.value},${flavor.text}`"
                    :items="evalutions"
                    item-title="text"
                    item-value="value"
                    variant="underlined"
                    class="text-center"
                  >
                  </v-select>
                </td>
              </tr>
              <tr>
                <td>甘み</td>
                <td>
                  <v-select
                    v-model="sweetness.value"
                    label="直感的な評価"
                    :hint="`${sweetness.value},${sweetness.text}`"
                    :items="evalutions"
                    item-title="text"
                    item-value="value"
                    variant="underlined"
                    class="text-center"
                  >
                  </v-select>
                </td>
              </tr>
              <tr>
                <td>コク</td>
                <td>
                  <v-select
                    v-model="rich.value"
                    label="直感的な評価"
                    :hint="`${rich.value},${rich.text}`"
                    :items="evalutions"
                    item-title="text"
                    item-value="value"
                    variant="underlined"
                    class="text-center"
                  >
                  </v-select>
                </td>
              </tr>
              <tr>
                <td>酸味</td>
                <td>
                  <v-select
                    v-model="acidity.value"
                    label="直感的な評価"
                    :hint="`${acidity.value},${acidity.text}`"
                    :items="evalutions"
                    item-title="text"
                    item-value="value"
                    variant="underlined"
                    class="text-center"
                  >
                  </v-select>
                </td>
              </tr>
              <tr>
                <td>苦味</td>
                <td>
                  <v-select
                    v-model="bitter.value"
                    label="直感的な評価"
                    :hint="`${bitter.value},${bitter.text}`"
                    :items="evalutions"
                    item-title="text"
                    item-value="value"
                    variant="underlined"
                    class="text-center"
                  >
                  </v-select>
                </td>
              </tr>
              <tr>
                <td>備考</td>
                <td><v-textarea v-model="item.remarks" /></td>
              </tr>
              <tr>
                <td>公開設定</td>
                <td>
                  <v-radio-group inline v-model="item.setting">
                    <v-radio label="公開" value="true"></v-radio>
                    <v-radio label="非公開" value="false"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
        <v-btn @click="postCoffee()">投稿する</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.container_out {
  width: 95%;
}
</style>
