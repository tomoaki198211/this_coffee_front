<script setup lang="ts">
import hot_img from "../assets/image/hot.png";
import ice_img from "../assets/image/ice.png";
import espresso_img from "../assets/image/espresso.png";
import rate_img from "../assets/image/rate.png";
import float_img from "../assets/image/float.png";
import tea_img from "../assets/image/tea.png";
import shop_img from "../assets/image/shop.png";
import beans_img from "../assets/image/beans.png";
import instant_img from "../assets/image/instant.png";
import can_img from "../assets/image/can.png";
import other_img from "../assets/image/other.png";

interface Props {
  id: any;
  height: number;
}
const props = defineProps<Props>();

const image_url: any = {
  1: hot_img,
  2: ice_img,
  3: espresso_img,
  4: rate_img,
  5: rate_img,
  6: rate_img,
  7: rate_img,
  8: float_img,
  9: float_img,
  10: tea_img,
  11: beans_img,
  12: instant_img,
  13: can_img,
  14: other_img,
};
</script>
<template>
  <v-img :src="`${image_url[props.id]}`" alt="" :height="props.height"></v-img>
</template>
