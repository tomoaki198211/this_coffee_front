<script setup lang="ts">
import { useRouter } from "vue-router";
import { mdiCoffeeOutline } from "@mdi/js";
import { mdiCommentTextOutline } from "@mdi/js";
import { mdiAccountPlus } from "@mdi/js";

const router = useRouter();
</script>
<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-col cols="12">
          <v-card color="#664738 " theme="dark" max-width="400">
            <v-card-title class="text-h5">this Coffee! </v-card-title>
            <v-card-text
              >このコーヒーは！と感嘆するような、あなたに合うコーヒーを探す手助けをします。あなたにとって至高の一杯を見つけましょう！</v-card-text
            >
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card color="#7b5544" theme="dark" max-width="400">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="text-h5">レビュー</v-card-title>
                <v-card-subtitle>review</v-card-subtitle>
                <v-card-text>
                  色々なレビューを読んで、コーヒーの評判を知りましょう。コーヒーを飲んだらあなたもレビューを書いて情報を共有しましょう。
                </v-card-text>
              </div>
              <v-avatar class="ma-3" size="125" rounded="0">
                <v-img src=""></v-img>
              </v-avatar>
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
                </v-card-text>
              </div>
              <v-avatar class="ma-3" size="125" rounded="0">
                <v-img src=""></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-col>
      <v-col cols="12" sm="6">
        <v-col cols="12">
          <v-card max-width="400">
            <v-card-title class="text-h6">メニュー</v-card-title>
            <v-card-text
              >右上のハンバーガーメニューアイコンを押すと「レビュー」「コーヒー」「ログイン」「新規登録」のメニューを表示します。</v-card-text
            >
            <v-divider></v-divider>
            <v-card-title class="text-h6">ログインについて</v-card-title>
            <v-card-text
              >ログイン（登録）なしでも他の人のレビューを読む事が出来ます。アカウントを登録する事で、「レビュー投稿」と
              コーヒーを「お気に入り」出来るようになります。</v-card-text
            ><v-divider></v-divider>
            <v-card-title class="text-h6">レビュー投稿</v-card-title>
            <v-card-text
              >ログインした状態でコーヒー検索をします。レビューを書きたい対象の「レビューを書く」
              を押してレビュー投稿画面に入ります。</v-card-text
            >
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                variant="outlined"
                color="blue-grey"
                :prepend-icon="mdiCoffeeOutline"
                @click="router.push('/coffees')"
                >コーヒー検索へ</v-btn
              >
            </v-card-actions>
            <v-card-actions>
              <v-btn
                variant="outlined"
                color="blue-grey"
                :prepend-icon="mdiCommentTextOutline"
                @click="router.push('/reviews')"
                >レビュー一覧へ</v-btn
              >
            </v-card-actions>
            <v-card-actions>
              <v-btn
                variant="outlined"
                color="blue-grey"
                :prepend-icon="mdiAccountPlus"
                @click="router.push('/auth/signup')"
                >アカウント登録</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>
