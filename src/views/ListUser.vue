<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import { mdiAccountSupervisorOutline } from "@mdi/js";
import { URL } from "../url";

const authStore = useAuthStore();
const router = useRouter();
const index: any = reactive({
  users: [],
});
const page = ref(1);
const itemsPerPage = 10;
const result = computed(() => {
  return index.users.length;
});

indexUsers();

async function indexUsers(): Promise<void> {
  await axios
    .get(`${URL.ADDRESS}/api/v1/admin/users`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.users = response.data;
    });
}
</script>

<template>
  <div>
    <v-container fluid grid-list-xl class="container_out">
      <v-chip class="ma-2" color="#7b5544" variant="text" size="large"
        ><v-icon start :icon="mdiAccountSupervisorOutline"></v-icon>
        ユーザー管理画面
      </v-chip>
      <v-table density="compact">
        <thead class="head_bg">
          <tr>
            <th><p class="txt-color">名前</p></th>
            <th><p class="txt-color">Email</p></th>
            <th><p class="txt-color">権限</p></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in index.users" :key="user.id">
            <td>
              <v-btn
                variant="text"
                size="small"
                @click="router.push(`/users/admin/edit/${user.id}`)"
              >
                {{ user.name }}
              </v-btn>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.admin }}</td>
          </tr>
        </tbody>
      </v-table>
      <v-pagination
        v-model="page"
        :length="Math.ceil(result / itemsPerPage)"
        rounded="circle"
        class="mt-2"
        size="x-large"
      ></v-pagination>
    </v-container>
  </div>
</template>
<style scoped>
.container_out {
  width: 100%;
}
td {
  font-size: 13px;
}
.head_bg {
  background-color: #7b5544;
}
.txt-color {
  color: #fff;
}
</style>
