<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useMessageStore } from "@/stores/message";
import { useRouter } from "vue-router";
import axios, { type AxiosResponse } from "axios";
import { mdiArrowLeftThick } from "@mdi/js";
import { mdiCoffeeOutline } from "@mdi/js";
import Image from "../components/CoffeeImage.vue";
import { URL } from "../url";

interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const messageStore = useMessageStore();
const router = useRouter();
const coffee = reactive({
  coffee_id: "",
  category_name: "",
  store_name: "",
  property_id: "",
  name: "",
  size: "",
  price: "",
  note: "",
  image: "",
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
      selected_store.id = response.data.coffee.coffee_property.store.id;
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
    });
}
async function updateCoffee(): Promise<void> {
  const data = {
    coffee: {
      coffee_id: coffee.coffee_id,
      store_id: selected_store.id,
      category_id: selected_category.id,
      property_id: coffee.property_id,
      coffee_name: coffee.name,
      size: coffee.size,
      price: coffee.price,
      note: coffee.note,
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
    .patch(`${URL.ADDRESS}/api/v1/coffees/${props.id}`, data, config)
    .then((response) => {
      showCoffee();
      messageStore.flash("更新しました");
      router.push("/coffees/admin/index");
    })
    .catch((error) => {
      messageStore.flash("更新出来ませんでした", "red");
    });
}
async function destroyCoffee(): Promise<void> {
  await axios
    .delete(`${URL.ADDRESS}/api/v1/coffees/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      messageStore.flash("削除しました");
      router.push("/coffees/admin/index");
    })
    .catch((error) => {
      messageStore.flash("削除出来ませんでした", "red");
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
          @click="router.push('/coffees/admin/index')"
          ><v-icon :icon="mdiArrowLeftThick" size="large"></v-icon
        ></v-btn>
      </v-col>
      <v-col cols="12" sm="11">
        <v-card class="mx-auto" max-width="500">
          <v-chip class="ma-2" color="#7b5544" variant="text" size="large"
            ><v-icon start :icon="mdiCoffeeOutline"></v-icon>
            コーヒーマスタ編集画面
          </v-chip>
          <Image :id="selected_category.id" :height="200" />
          <v-divider></v-divider>
          <v-list-item>
            <v-select
              v-model="selected_category.id"
              label="分類"
              :items="categories"
              item-title="name"
              item-value="id"
              variant="underlined"
              class="text-center"
            >
            </v-select>
            <v-select
              v-model="selected_store.id"
              label="販売店"
              :items="stores"
              item-title="name"
              item-value="id"
              variant="underlined"
              class="text-center"
            >
            </v-select>
            <v-text-field
              v-model="coffee.name"
              label="商品名"
              variant="underlined"
            >
            </v-text-field>
            <v-text-field
              v-model="coffee.size"
              label="サイズ"
              variant="underlined"
            >
            </v-text-field>
            <v-text-field
              v-model="coffee.price"
              label="価格"
              variant="underlined"
            >
            </v-text-field>
            <v-textarea
              v-model="coffee.note"
              label="ノート"
              variant="underlined"
            >
            </v-textarea>
          </v-list-item>
          <v-card-actions>
            <v-btn
              class="mx-auto"
              variant="flat"
              color="#7b5544"
              @click="updateCoffee()"
            >
              <p class="font-weight-bold btn-txt">更新</p>
            </v-btn>
            <v-btn
              class="mx-auto"
              variant="flat"
              color="#7b5544"
              @click="destroyCoffee()"
            >
              <p class="font-weight-bold btn-txt">削除</p>
            </v-btn>
          </v-card-actions>
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
