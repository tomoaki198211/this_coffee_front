<template>
  <v-footer class="footer" color="#7b5544">
    <v-row justify="center">
      <v-col class="text-center" cols="12">
        <p class="footer_txt">
          {{ new Date().getFullYear() }} —
          <strong>this Coffee! by tomoaki</strong>
        </p>
      </v-col>
    </v-row>
  </v-footer>
</template>
<style scoped>
.footer_txt {
  color: white;
}
.footer {
  width: 100%;
  position: absolute;
  bottom: 0;
}
</style>
