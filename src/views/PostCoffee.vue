<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useMessageStore } from "@/stores/message";
import { useRouter } from "vue-router";
import axios from "axios";
import { mdiArrowLeftThick } from "@mdi/js";
import Image from "@/components/CoffeeImage.vue";
import { URL } from "../url";

const authStore = useAuthStore();
const messageStore = useMessageStore();
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

async function postCoffeeMaster(): Promise<void> {
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
    .post(`${URL.ADDRESS}/api/v1/coffees`, data, config)
    .then((response) => {
      messageStore.flash("作成しました");
      router
        .push({
          path: "/coffees/admin/index",
        })
        .catch((error) => {
          messageStore.flash("作成出来ませんでした", "red");
        });
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
          <!-- <v-img src="" alt="" height="200" cover></v-img> -->
          <Image v-bind:id="Number(selected_category.id)" v-bind:height="200" />
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
              block
              class="mx-auto"
              variant="flat"
              color="#7b5544"
              @click="postCoffeeMaster()"
            >
              <p class="font-weight-bold btn-txt">作成</p>
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
