<script setup lang="ts">
import { ref, reactive } from "vue";

const unit = 100;
const canvasList = ref([]); // キャンバスの配列
const info = ref({}); // 全キャンバス共通の描画情報
const colorList = ref([]); // 各キャンバスの色情報
init();
/**
 * Init function.
 *
 * Initialize letiables and begin the animation.
 */
function init() {
  info.value.seconds = 0;
  info.value.t = 0;
  canvasList.value = [];
  colorList.value = [];
  // canvas1個めの色指定
  canvasList.value.push(document.getElementById("waveCanvas"));
  colorList.value.push(["#43c0e4"]);
  // 各キャンバスの初期化
  for (let canvasIndex in canvasList) {
    let canvas = canvasList[canvasIndex];
    canvas.width = document.documentElement.clientWidth; //Canvasのwidthをウィンドウの幅に合わせる
    canvas.height = 200; //波の高さ
    canvas.contextCache = canvas.getContext("2d");
  }
  // 共通の更新処理呼び出し
  update();
}

function update() {
  for (let canvasIndex in canvasList) {
    let canvas = canvasList[canvasIndex];
    // 各キャンバスの描画
    draw(canvas, colorList[canvasIndex]);
  }
  // 共通の描画情報の更新
  info.value.seconds = info.value.seconds + 0.014;
  info.value.t = info.value.seconds * Math.PI;
  // 自身の再起呼び出し
  setTimeout(update, 35);
}

/**
 * Draw animation function.
 *
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */
function draw(canvas, color) {
  // 対象のcanvasのコンテキストを取得
  let context = canvas.contextCache;
  // キャンバスの描画をクリア
  context.clearRect(0, 0, canvas.width, canvas.height);

  //波を描画 drawWave(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ )
  drawWave(canvas, color[0], 1, 3, 0); //drawWave(canvas, color[0],0.5, 3, 0);とすると透過50%の波が出来る
}

/**
 * 波を描画
 * drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawWave(canvas, color, alpha, zoom, delay) {
  let context = canvas.contextCache;
  context.fillStyle = color; //塗りの色
  context.globalAlpha = alpha;
  context.beginPath(); //パスの開始
  drawSine(canvas, info.value.t / 0.5, zoom, delay);
  context.lineTo(canvas.width + 10, canvas.height); //パスをCanvasの右下へ
  context.lineTo(0, canvas.height); //パスをCanvasの左下へ
  context.closePath(); //パスを閉じる
  context.fill(); //波を塗りつぶす
}

/**
 * Function to draw sine
 *
 * The sine curve is drawn in 10px segments starting at the origin.
 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawSine(canvas, t, zoom, delay) {
  let xAxis = Math.floor(canvas.height / 2);
  let yAxis = 0;
  let context = canvas.contextCache;
  // Set the initial x and y, starting at 0,0 and translating to the origin on
  // the canvas.
  let x = t; //時間を横の位置とする
  let y = Math.sin(x) / zoom;
  context.moveTo(yAxis, unit * y + xAxis); //スタート位置にパスを置く

  // Loop to draw segments (横幅の分、波を描画)
  for (let i = yAxis; i <= canvas.width + 10; i += 10) {
    x = t + (-yAxis + i) / unit / zoom;
    y = Math.sin(x - delay) / 3;
    context.lineTo(i, unit * y + xAxis);
  }
}
</script>

<template>
  <canvas id="waveCanvas" width="100%" ref="canRef"></canvas>
</template>
