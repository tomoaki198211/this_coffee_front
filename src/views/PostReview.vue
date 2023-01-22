<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import axios, { type AxiosResponse } from "axios";

const evalutions = [
  { id: 5, text: "5:高い" },
  { id: 4, text: "4:やや高い" },
  { id: 3, text: "3:普通" },
  { id: 2, text: "2:やや低い" },
  { id: 1, text: "1:低い" },
];

const item = reactive({
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
</script>

<template>
  <div>
    <table>
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
            <select v-model="item.intuition">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td>コストパフォーマンス</td>
          <td>
            <select v-model="item.efficiency">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td>風味</td>
          <td>
            <select v-model="item.flavor">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td>甘み</td>
          <td>
            <select v-model="item.sweetness">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td>コク</td>
          <td>
            <select v-model="item.rich">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td>酸味</td>
          <td>
            <select v-model="item.acidity">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td>苦味</td>
          <td>
            <select v-model="item.bitter">
              <option
                v-for="evalution in evalutions"
                :value="evalution.id"
                :key="evalution.id"
              >
                {{ evalution.text }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td>備考</td>
          <td><input type="texterea" v-model="item.remarks" /></td>
        </tr>
        <tr>
          <td>公開設定</td>
          <td>
            <input type="radio" value="true" v-model="item.setting" />
            <label>公開</label>
            <input type="radio" value="false" v-model="item.setting" />
            <label>非公開</label>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
