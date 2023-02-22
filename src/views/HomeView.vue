<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { mdiCoffeeOutline } from "@mdi/js";
import { mdiCommentTextOutline } from "@mdi/js";
import { mdiAccountPlus } from "@mdi/js";
import { mdiAccountSupervisorOutline } from "@mdi/js";
import review_img from "@/assets/image/review.jpg";
import pc_img from "@/assets/image/pc_coffee.jpg";

const router = useRouter();
const authStore = useAuthStore();
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <v-col cols="12">
          <v-card color="#996a54" theme="dark" max-width="400">
            <v-card-title class="text-h5">this Coffee! </v-card-title>
            <v-card-text
              >このコーヒーは！と感嘆するような、あなたに合うコーヒーを探す手助けをします。あなたにとって至高の一杯を見つけましょう！</v-card-text
            >
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card color="#996a54" theme="dark" max-width="400">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-avatar class="ma-3" size="150" rounded="0">
                  <v-img :src="review_img"></v-img>
                </v-avatar>
              </div>
              <div>
                <v-card-title class="text-h5">レビュー</v-card-title>
                <v-card-subtitle>review</v-card-subtitle>
                <v-card-text>
                  色々なレビューを読んで、コーヒーの評判を知りましょう。コーヒーを飲んだらあなたもレビューを書いて情報を共有しましょう。
                </v-card-text>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card color="#996a54" theme="dark" max-width="400">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="text-h5">コーヒー検索</v-card-title>
                <v-card-subtitle>search</v-card-subtitle>
                <v-card-text>
                  色々なコーヒーの情報を検索して、どんなコーヒーがあるか調べましょう。
                  各コーヒーはレビューの平均値やtwitterで口コミを見る事が出来ます。
                </v-card-text>
              </div>
              <v-avatar class="ma-3" size="150" rounded="0">
                <v-img :src="pc_img"></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-col>
      <v-col cols="12" sm="6">
        <v-col cols="12">
          <v-card max-width="400">
            <v-card-title class="text-h6 bg-color"
              ><v-app-bar-nav-icon variant="plain"></v-app-bar-nav-icon
              >メニュー</v-card-title
            >
            <v-card-text
              >スマートフォンでは右上のハンバーガーメニューアイコンを押すと「レビュー」「コーヒー」「ログイン」「新規登録」のメニューを表示します。
              パソコンでは上記メニューを押す事で画面を移動出来ます。</v-card-text
            >
            <v-divider></v-divider>
            <v-card-title class="text-h6 bg-color"
              ><v-icon :icon="mdiAccountSupervisorOutline"></v-icon
              >ログインについて</v-card-title
            >
            <v-card-text
              >ログイン（登録）なしでも他の人のレビューを読む事が出来ます。アカウントを登録する事で、「レビュー投稿」と
              コーヒーを「お気に入り」出来るようになります。また、マイカウントで「今日の一杯」と「好みからレビューおすすめ検索」が可能です。</v-card-text
            ><v-divider></v-divider>
            <v-card-title class="text-h6 bg-color"
              ><v-icon :icon="mdiCommentTextOutline"></v-icon
              >レビュー投稿</v-card-title
            >
            <v-card-text
              >ログインした状態でコーヒー検索をします。レビューを書きたい対象の「レビューを書く」
              を押してレビュー投稿画面に入ります。</v-card-text
            >
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                block
                variant="outlined"
                color="#7b5544"
                :prepend-icon="mdiCoffeeOutline"
                @click="router.push('/coffees')"
                >コーヒー検索を試す</v-btn
              >
            </v-card-actions>
            <v-card-actions>
              <v-btn
                block
                variant="outlined"
                color="#7b5544"
                :prepend-icon="mdiCommentTextOutline"
                @click="router.push('/reviews')"
                >レビューを見てみる</v-btn
              >
            </v-card-actions>
            <template v-if="!authStore.isAuthencated()">
              <v-card-actions>
                <v-btn
                  block
                  variant="outlined"
                  color="#7b5544"
                  :prepend-icon="mdiAccountPlus"
                  @click="router.push('/auth/signup')"
                  >アカウントを登録する！</v-btn
                >
              </v-card-actions>
            </template>
          </v-card>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.bg-color {
  color: #7b5544;
}
</style>
