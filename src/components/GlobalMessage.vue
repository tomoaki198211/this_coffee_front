<script setup lang="ts">
import { useMessageStore } from "../stores/message";

const messageStore = useMessageStore();
</script>

<template v-if="(messageStore.flag = true)">
  <v-row>
    <v-col>
      <div class="message">
        <p
          class="text-center font-weight-bold pt-2"
          v-bind:style="{ color: messageStore.color }"
        >
          {{ messageStore.text }}
        </p>
      </div>
    </v-col>
  </v-row>
</template>
<style scoped>
.message {
  height: 30px;
}
</style>
