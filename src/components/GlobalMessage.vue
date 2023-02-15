<script setup lang="ts">
import { useMessageStore } from "../stores/message";

const messageStore = useMessageStore();
</script>

<template v-if="(messageStore.flag = true)">
  <p class="text-center font-weight-bold pt-2">{{ messageStore.text }}</p>
</template>
<style scoped>
p {
  color: #7b5544;
}
</style>
