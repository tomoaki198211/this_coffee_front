<template>
  <Radar :data="setData" :options="setOptions" />
</template>

<script>
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "vue-chartjs";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default {
  name: "RadarChart",
  components: { Radar },
  props: {
    flavor: Number,
    sweetness: Number,
    rich: Number,
    acidity: Number,
    bitter: Number,
  },
  computed: {
    setData() {
      return {
        labels: ["風味", "甘み", "コク", "酸味", "苦味"],
        datasets: [
          {
            label: "特性",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "#7b5544",
            pointBackgroundColor: "#7b5544",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#7b5544",
            data: [
              this.flavor,
              this.sweetness,
              this.rich,
              this.acidity,
              this.bitter,
            ],
          },
        ],
      };
    },
    setOptions() {
      return {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          r: {
            angleLines: {
              display: false,
            },
            pointLabels: {
              font: {
                size: 16,
              },
            },
            suggestedMin: 1,
            suggestedMax: 5,
            ticks: {
              stepSize: 1,
            },
          },
        },
      };
    },
  },
};
</script>
