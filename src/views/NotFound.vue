<script setup lang="ts">
import { useRouter } from "vue-router";
import { mdiHomeOutline } from "@mdi/js";

const router = useRouter();
</script>
<template>
  <v-row align-content="center" style="height: 500px">
    <v-row>
      <v-col cols="12">
        <p class="text-center text-h5 mb-5">
          指定のURLは無効です。ページが見つかりません。
        </p>
        <br />
        <p class="text-center text-h5 mb-5">
          <span>
            <v-btn
              class="mx-auto"
              variant="plain"
              @click="router.push('/')"
              :prepend-icon="mdiHomeOutline"
              size="x-large"
              >ホームに戻る場合はこちら
            </v-btn>
          </span>
        </p>
      </v-col>
    </v-row>
  </v-row>
</template>
<style scoped></style>
