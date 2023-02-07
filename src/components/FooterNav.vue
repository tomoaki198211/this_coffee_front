<template>
  <v-footer class="">
    <v-row justify="center" no-gutters>
      <v-btn color="white" variant="text" class="mx-2" rounded="xl">
        {{}}
      </v-btn>
      <v-col class="text-center mt-4" cols="12">
        {{ new Date().getFullYear() }} — <strong>this Coffee!</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>
