<script setup lang="ts">
import { useMessageStore } from "../stores/message";

const messageStore = useMessageStore();
</script>

<template v-if="(messageStore.flag = true)">
  <div class="message">
    <p class="text-center font-weight-bold pt-2">{{ messageStore.text }}</p>
  </div>
</template>
<style scoped>
p {
  color: #7b5544;
}
.message {
  height: 30px;
}
</style>
