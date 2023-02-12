<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import axios, { type AxiosResponse } from "axios";
import { mdiArrowLeftThick } from "@mdi/js";

interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const router = useRouter();
const coffee = reactive({
  coffee_id: "",
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
      console.log(response.data);
    });
}
async function updateCoffeeMaster(): Promise<void> {
  const data = {
    review: {
      coffee_id: coffee.coffee_id,
      property_id: coffee.property_id,
      name: coffee.name,
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
    .patch(
      `http://localhost:3000/api/v1/reviews/${review_id.value}`,
      data,
      config
    )
    .then((response) => {
      showCoffee();
      console.log(response.data);
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
          @click="router.push('/coffees/master')"
          ><v-icon :icon="mdiArrowLeftThick" size="large"></v-icon
        ></v-btn>
      </v-col>
      <v-col cols="12" sm="11">
        <v-card class="mx-auto" max-width="500">
          <v-img src="" alt="" height="200" cover></v-img>
          <v-divider></v-divider>
          <v-list-item>
            <v-select
              v-model="selected_category.id"
              label="分類"
              :hint="`${selected_category.id},${selected_category.name}`"
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
              :hint="`${selected_store.id},${selected_store.name}`"
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
              @click="updateCoffeeMaster()"
            >
              <p class="font-weight-bold btn-txt">更新</p>
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
