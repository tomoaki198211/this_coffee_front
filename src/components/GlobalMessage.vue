<script setup lang="ts">
import { useMessageStore } from "../stores/message";

const messageStore = useMessageStore();
</script>

<template v-if="(messageStore.flag = true)">
  <v-alert color="#ffff">
    <p class="text-center font-weight-bold">{{ messageStore.text }}</p>
  </v-alert>
</template>
<style scoped>
p {
  color: #7b5544;
}
</style>
