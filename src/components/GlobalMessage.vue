<script setup lang="ts">
import { useMessageStore } from "../stores/message";

const messageStore = useMessageStore();
</script>

<template v-if="(messageStore.flag = true)">
  <v-row>
    <v-col>
      <div class="message">
        <p class="text-center font-weight-bold pt-2">{{ messageStore.text }}</p>
      </div>
    </v-col>
  </v-row>
</template>
<style scoped>
p {
  color: #7b5544;
}
.message {
  height: 30px;
}
</style>
