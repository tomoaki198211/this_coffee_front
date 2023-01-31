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
  { id: 5, text: "5:高い" },
  { id: 4, text: "4:やや高い" },
  { id: 3, text: "3:普通" },
  { id: 2, text: "2:やや低い" },
  { id: 1, text: "1:低い" },
];
const evalutions2 = [5, 4, 3, 2, 1];
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
      intuition: item.intuition,
      efficiency: item.efficiency,
      flavor: item.flavor,
      sweetness: item.sweetness,
      rich: item.rich,
      acidity: item.acidity,
      bitter: item.bitter,
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
  <div>
    販売店: {{ p_name ? p_name.coffee.coffee_property.store.name : "" }}<br />
    商品名: {{ p_name ? p_name.coffee.coffee_property.name : "" }}
    <v-table>
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
            <v-select v-model="item.intuition">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </v-select>
          </td>
        </tr>
        <tr>
          <td>コストパフォーマンス</td>
          <td>
            <v-select
              v-model="item.efficiency"
              :items="evalutions2"
              variant="underlined"
              class="text-center"
            >
              <!-- <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option> -->
            </v-select>
          </td>
        </tr>
        <tr>
          <td>風味</td>
          <td>
            <v-select v-model="item.flavor">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </v-select>
          </td>
        </tr>
        <tr>
          <td>甘み</td>
          <td>
            <v-select v-model="item.sweetness">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </v-select>
          </td>
        </tr>
        <tr>
          <td>コク</td>
          <td>
            <v-select v-model="item.rich">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </v-select>
          </td>
        </tr>
        <tr>
          <td>酸味</td>
          <td>
            <v-select v-model="item.acidity">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </v-select>
          </td>
        </tr>
        <tr>
          <td>苦味</td>
          <td>
            <v-select v-model="item.bitter">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
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
    <v-btn @click="postCoffee()">投稿する</v-btn>
    <v-card class="mx-auto">
      <div class="d-flex justify-center">
        <RadarChart
          :flavor="item.flavor"
          :sweetness="item.sweetness"
          :rich="item.rich"
          :acidity="item.acidity"
          :bitter="item.bitter"
        />
      </div>
    </v-card>
  </div>
</template>
